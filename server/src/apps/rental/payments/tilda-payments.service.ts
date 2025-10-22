import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CreateAdminPaymentDto } from './dto';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CellRentalsService } from '../cell-rentals/cell-rentals.service';
import { RequestsService } from '@/apps/lead-management/requests/requests.service';
import { NormalizeCells } from './utils/normalizeCells'
import { UsersService } from '@/apps/users/users.service';
import { NormalizeRequestForm } from './utils/normalizeRequestForm';
import { TildaPaymentPayload } from './types/tildaPaymentPayload';
import { PaymentsRepo } from './payment.repo';

type RequestTilda = {
    email: string;
    phone: string;
    name: string;
    sizeform: string;
    formname: string;
    rentalDuration?: {
        value: number;
        unit: string;
    }
}

type NormalizeTildaType = {
    email: string; 
    phone: string;
    name: string;
    cellNumber: string; 
    secondCellNumber: string;
    sizeform: string;
    amount: number;
    description: string;
    rentalDuration?: {
        value: number;
        unit: string;
    }
    systranid: string;
}

@Injectable()
export class TildaPaymentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
        private readonly cellRentalsService: CellRentalsService,
        private readonly usersService: UsersService,
        private readonly requestsService: RequestsService,
        private readonly paymentRepo: PaymentsRepo,
    ) {
        this.logger.debug?.('TildaPaymentsService instantiated', TildaPaymentsService.name);
    }

    async createTildaPayment(payload: TildaPaymentPayload) {
        this.logger.log(`=== Processing Tilda payment ===`, TildaPaymentsService.name);

        const data = this._normalizeTildaPayload(payload);
        const { email, phone, name, cellNumber, secondCellNumber, sizeform, amount, description, rentalDuration, systranid } = data;

        try {
            if (payload.formname !== 'Cart') {
                return this._createRequestTilda({...data, formname: payload.formname})
            }

            const user = await this.usersService.findOrCreateUserWithClient({ email, phone, name });
            if (!user.client) {
                throw new InternalServerErrorException('Не удалось создать или найти пользователя');
            }

            let cell: any | null = null;
            let errorMessage = null;
            let isExtension = false;

            try {
                cell = await this.cellRentalsService.findAvailableCellClient(cellNumber, user.client.id);

                if (cell && cell.rentals && cell.rentals.length > 0) {
                    isExtension = true;
                    this.logger.log(`This is a rental extension for cell ${cellNumber}`, TildaPaymentsService.name);
                }
            } catch (cellError) {
                errorMessage = cellError.message;
                this.logger.error(`Cell error: ${cellError.message}`, cellError.stack, TildaPaymentsService.name);
            }

            const paymentDetails = await this._preparePaymentDetails(
                user.id,
                cell,
                amount,
                description,
                {
                    cellNumber,
                    sizeform,
                    rentalDuration,
                    systranid
                }
            );

            if (secondCellNumber) {
                paymentDetails.description += `; Доп. ячейка: ${secondCellNumber}`;
            }

            if (errorMessage) {
                paymentDetails.description = `ПРОБЛЕМНЫЙ ПЛАТЕЖ: ${paymentDetails.description} - ${errorMessage}`;
            } else if (isExtension) {
                paymentDetails.description = `${paymentDetails.description}`;
            }

            const payment = await this.paymentRepo.createPaymentByAdminDb(paymentDetails);

            if (secondCellNumber) {
                try {
                    const secondCell = await this.cellRentalsService.findAvailableCellClient(secondCellNumber, user.client.id);
                    const cellIds: string[] = [];
                    if (cell?.id) cellIds.push(cell.id);
                    if (secondCell?.id) cellIds.push(secondCell.id);

                    if (cellIds.length >= 2 && payment) {
                        await this._processMultipleCellsRental(
                            cellIds,
                            user.client.id,
                            payment.id,
                            paymentDetails.description || undefined,
                            rentalDuration
                        );
                    }
                } catch (e) {
                    this.logger.error(`Failed to process second cell ${secondCellNumber}: ${e.message}`, e.stack, TildaPaymentsService.name);
                }
            }

            return {
                success: !errorMessage,
                message: errorMessage || 'Платеж успешно создан',
                payment,
                error: errorMessage
            };

        } catch (error) {
            this.logger.error(`Failed to process Tilda payment: ${error.message}`, error.stack, TildaPaymentsService.name);
            throw error;
        }
    }

    /**
     * Метод для обработки всех форм не Cart
     * @param data 
     * @returns 
     */
    private async _createRequestTilda(data: RequestTilda) {
        this.logger.log(`Creating Request for non-Cart form: ${data.formname}`, TildaPaymentsService.name);

        const { parsedSize, parsedLocation } = NormalizeRequestForm(data.sizeform)

        const request = await this.requestsService.createRequest({
            email: data.email,
            phone: data.phone,
            name: data.name,
            sizeform: parsedSize,
            location: parsedLocation,
            comment: data.rentalDuration ? `Срок аренды: ${data.rentalDuration.value} ${data.rentalDuration.unit}` : undefined,
        });

        return {
            success: true,
            message: 'Заявка создана',
            request,
            payment: null,
            error: null
        };
    }

    private _calculateRentalEndDate(startDate: Date, value: number, unit: string): Date {
        const endDate = new Date(startDate);
        const normalizedUnit = unit.toLowerCase().trim();

        if (normalizedUnit.includes('мес') || normalizedUnit.includes('month')) {
            endDate.setMonth(endDate.getMonth() + value);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (normalizedUnit.includes('дн') || normalizedUnit.includes('day')) {
            endDate.setDate(endDate.getDate() + value);
            endDate.setHours(23, 59, 59, 999);
        }
        else if (normalizedUnit.includes('год') || normalizedUnit.includes('year')) {
            endDate.setFullYear(endDate.getFullYear() + value);
            endDate.setHours(23, 59, 59, 999);
        }

        return endDate;
    }

    private _normalizeTildaPayload(payload: TildaPaymentPayload): NormalizeTildaType {
        const context = 'TildaPayload';
        const p = Object.keys(payload).reduce(
            (acc, key) => {
                acc[key.toLowerCase()] = payload[key];
                return acc;
            },
            {} as Record<string, any>,
        );

        const email = p.email;
        const phone = p.phone;
        const name = p.name || '';
        let cellNumber = p.individualnumber;
        let secondCellNumber = p.individualnumber2;

        if (cellNumber) {
            this.logger.log(`Original Tilda cellNumber: ${cellNumber}`, context);
            cellNumber = NormalizeCells(cellNumber);
            this.logger.log(`Normalized Tilda cellNumber: ${cellNumber}`, context);
        }
        if (secondCellNumber) {
            this.logger.log(`Original Tilda second cellNumber: ${secondCellNumber}`, context);
            secondCellNumber = NormalizeCells(secondCellNumber);
            this.logger.log(`Normalized Tilda second cellNumber: ${secondCellNumber}`, context);
        }

        let paymentJson: any = {};
        if (typeof p.payment === 'string') {
            try {
                paymentJson = JSON.parse(p.payment);
            } catch (e) {
                this.logger.error(`Не удалось распарсить поле payment: ${e.message}`, e.stack, context);
            }
        }

        const amount = Number(paymentJson.amount || p.amount || 0);
        if (isNaN(amount) || amount < 0) {
            this.logger.warn(`Invalid amount: ${amount}, setting to 0`, context);
        }

        let sizeform = p.sizeform;
        let rentalDuration: { value: number; unit: string } | undefined;
        let description = '';

        if (Array.isArray(paymentJson.products) && paymentJson.products.length > 0) {
            description = paymentJson.products
                .map((prod: string) => prod.split('=')[0])
                .join('; ');

            const prod = paymentJson.products[0] as string;
            const bracketMatch = prod.match(/\(([^)]+)\)/);
            if (bracketMatch) {
                const parts = bracketMatch[1].split(',').map((s) => s.trim());
                if (!sizeform) {
                    sizeform = parts[0];
                }

                const rentalStringPart = parts.find((part) => part.toLowerCase().includes('срок аренды'));
                if (rentalStringPart) {
                    const rentalString = rentalStringPart.replace(/срок аренды:/i, '').trim();
                    const [value, unit] = rentalString.split(' ');
                    const numValue = parseInt(value, 10);

                    if (!isNaN(numValue)) {
                        rentalDuration = { value: numValue, unit: unit || 'мес' };
                        this.logger.log(`Parsed rental duration: ${numValue} ${unit}`, context);
                    }
                }
            }
        }

        const systranid = paymentJson.systranid;
        this.logger.log(`Payment systranid: ${systranid}`, context);

        return { email, phone, name, cellNumber, secondCellNumber, sizeform, amount, description, rentalDuration, systranid };
    }

    private async _preparePaymentDetails(
        userId: string,
        cell: any,
        amount: number,
        tildaDescription: string,
        tildaInfo: { cellNumber?: string; sizeform?: string; rentalDuration?: { value: number; unit: string }; systranid?: string },
    ): Promise<CreateAdminPaymentDto> {
        const activeStatus = await this.prisma.cellStatus.findFirst({
            where: {
                statusType: 'ACTIVE'
            }
        });

        this.logger.log(`Found active status for Tilda payment: ${activeStatus?.id || 'not found'}`, TildaPaymentsService.name);

        let rentalDurationDays: number | undefined;
        if (tildaInfo.rentalDuration) {
            const { value, unit } = tildaInfo.rentalDuration;
            if (unit.startsWith('мес')) {
                rentalDurationDays = value * 30;
            } else if (unit.startsWith('дн') || unit.startsWith('day')) {
                rentalDurationDays = value;
            } else if (unit.startsWith('год') || unit.startsWith('year')) {
                rentalDurationDays = value * 365;
            }
        }

        const paymentPayload: Partial<CreateAdminPaymentDto> = {
            userId: userId,
            amount: amount > 0 ? amount : 0,
            status: true,
            rentalDuration: rentalDurationDays,
            bankPaymentId: tildaInfo.systranid,
            statusId: activeStatus?.id
        };

        const { cellNumber, sizeform } = tildaInfo;

        let description = tildaDescription || 'Платеж из Tilda';

        if (cellNumber) {
            description += ` (Ячейка: ${cellNumber})`;
        } else if (sizeform) {
            description += ` (Размер: ${sizeform})`;
        }

        if (cell) {
            paymentPayload.cellId = cell.id;
        }

        paymentPayload.description = description;

        return paymentPayload as CreateAdminPaymentDto;
    }

    private async _processMultipleCellsRental(
        cellIds: string[],
        clientId: string,
        paymentId: string,
        description?: string,
        rentalDuration?: { value: number; unit: string }
    ) {
        const uniqueCellIds = Array.from(new Set(cellIds));

        this.logger.log(`Checking if all ${uniqueCellIds.length} cells exist...`, TildaPaymentsService.name);
        const cells = await this.prisma.cells.findMany({
            where: { id: { in: uniqueCellIds } }
        });

        if (cells.length !== uniqueCellIds.length) {
            const foundIds = cells.map(c => c.id);
            const missingIds = uniqueCellIds.filter(id => !foundIds.includes(id));
            throw new BadRequestException(`Ячейки не найдены: ${missingIds.join(', ')}`);
        }

        this.logger.log(`Found ${cells.length} cells: ${cells.map(c => c.name).join(', ')}`, TildaPaymentsService.name);

        this.logger.log('Checking for existing active rentals...', TildaPaymentsService.name);
        const activeRentals = await this.prisma.cellRental.findMany({
            where: {
                cell: {
                    some: {
                        id: { in: uniqueCellIds }
                    }
                }
            },
            include: {
                cell: true,
                client: {
                    include: {
                        user: true
                    }
                }
            }
        });

        const statuses = await this.prisma.cellStatus.findFirst({
            where: {
                statusType: "ACTIVE"
            }
        })

        const conflictingRentals = activeRentals.filter(rental => rental.clientId !== clientId);
        const sameClientRentals = activeRentals.filter(rental => rental.clientId === clientId);

        if (conflictingRentals.length > 0) {
            const conflictingCellNames = conflictingRentals
                .flatMap(rental => rental.cell?.map(c => c.name) || [])
                .join(', ');
            const errorMessage = `Ячейки уже арендованы другими клиентами: ${conflictingCellNames}`;
            this.logger.error(errorMessage, '', TildaPaymentsService.name);
            throw new BadRequestException(errorMessage);
        }

        if (sameClientRentals.length > 0) {
            this.logger.log(`Found ${sameClientRentals.length} existing rentals for the same client.`, TildaPaymentsService.name);

            const alreadyRentedCellIds = sameClientRentals.flatMap(rental =>
                rental.cell?.map(c => c.id) || []
            );

            const newCellIds = uniqueCellIds.filter(id => !alreadyRentedCellIds.includes(id));

            this.logger.log(`Already rented cells: ${alreadyRentedCellIds.length}, New cells to add: ${newCellIds.length}`, TildaPaymentsService.name);

            const latestRental = sameClientRentals.reduce((latest, current) =>
                new Date(current.endDate) > new Date(latest.endDate) ? current : latest
            );

            if (newCellIds.length > 0) {
                this.logger.log(`Adding ${newCellIds.length} new cells to existing rental ${latestRental.id}`, TildaPaymentsService.name);

                await this.prisma.cellRental.update({
                    where: { id: latestRental.id },
                    data: {
                        cell: {
                            connect: newCellIds.map(id => ({ id }))
                        }
                    }
                });
            }

            const newEndDate = rentalDuration
                ? this._calculateRentalEndDate(new Date(latestRental.endDate), rentalDuration.value, rentalDuration.unit)
                : this._calculateRentalEndDate(new Date(latestRental.endDate), 1, 'month');


            const updatedRental = await this.prisma.cellRental.update({
                where: { id: latestRental.id },
                data: {
                    endDate: newEndDate,
                    lastExtendedAt: new Date(),
                    extensionCount: { increment: 1 },
                    statusId: statuses?.id,
                }
            });

            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    cellRentalId: updatedRental.id,
                    description: description || `Продление аренды ячеек: ${cells.map(c => c.name).join(', ')}`
                }
            });

            this.logger.log(`Payment ${paymentId} linked to updated rental ${updatedRental.id}`, TildaPaymentsService.name);
            return updatedRental;
        }

        try {
            const startDate = new Date();
            const endDate = rentalDuration
                ? this._calculateRentalEndDate(new Date(startDate), rentalDuration.value, rentalDuration.unit)
                : this._calculateRentalEndDate(new Date(startDate), 1, 'month');

            if (!statuses) return null;

            const rental = await this.cellRentalsService.create({
                cellIds: uniqueCellIds,
                clientId: clientId,
                statusId: statuses.id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });

            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    cellRentalId: rental.id,
                    description: description || `Аренда ячеек: ${cells.map(c => c.name).join(', ')}`
                }
            });

            this.logger.log(`Payment ${paymentId} linked to rental ${rental.id}`, TildaPaymentsService.name);
            return rental;
        } catch (error) {
            this.logger.error(`Error in _processMultipleCellsRental: ${error.message}`, error.stack, TildaPaymentsService.name);
            throw error;
        }
    }
} 