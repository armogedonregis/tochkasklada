import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { CreateAdminPaymentDto } from './dto/create-admin-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';



@Injectable()
export class PaymentsRepo {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {
        this.logger.debug?.('PaymentsRepo instantiated', PaymentsRepo.name);
    }

    /**
     * Find payment by id
     */
    async findByIdDb(id: string) {
        const payment = await this.prisma.payment.findFirst({ 
            where: { id: id },
        })
        if (!payment) {
            throw new NotFoundException(`Платеж с ID ${id} не найден`);
        }
        return payment;
    }

    /**
     * Create payment by admin
     */
    async createPaymentByAdminDb(data: CreateAdminPaymentDto) {
        const payment = await this.prisma.payment.create({
            data: {
                amount: data.amount,
                description: data.description,
                userId: data.userId,
                bankPaymentId: data.bankPaymentId,
                paymentUrl: data.paymentUrl,
                rentalDuration: data.rentalDuration,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                },
                cellRental: {
                    include: {
                        cell: true
                    }
                }
            }
        });
        return payment;
    }

    /**
     * Update payment by admin
     */
    async updatePaymentByAdminDb(id: string, data: UpdatePaymentDto) {
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        client: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            }
        });
        return updatedPayment;
    }

    
}