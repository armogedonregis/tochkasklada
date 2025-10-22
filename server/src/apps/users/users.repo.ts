import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { NormalizeName } from './utils/normalizeName';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@prisma/client';
import { FindOrCreateUserWithClientData } from './users.interface';

@Injectable()
export class UsersRepo {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {
        this.logger.debug?.('UsersRepo instantiated', UsersRepo.name);
    }

    /**
     * FindUser
     */
    async findUniqUser(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
            include: {
                client: {
                    include: {
                        phones: true
                    }
                }
            }
        })
        return user;
    }

    /**
     * create user with client
     */
    async createUserWithClient(data: FindOrCreateUserWithClientData) {
        const { email, phone, name } = data;
        const prettyName = name ? NormalizeName(name) : undefined;
        const user = await this.prisma.user.create({
            data: {
                email,
                password: uuidv4(),
                role: UserRole.CLIENT,
                client: {
                    create: {
                        name: prettyName || uuidv4(),
                        phones: {
                            create: phone ? { phone } : undefined
                        }
                    }
                },
            },
            include: {
                client: {
                    include: {
                        phones: true
                    }
                }
            }
        })
        return user;
    }

    /**
     * Create user phone for client
     */
    async createUserPhoneForClient(phone: string, clientId: string) {
        const newPhone = await this.prisma.clientPhone.create({
            data: {
                phone,
                clientId
            }
        });
        return newPhone;
    }
}