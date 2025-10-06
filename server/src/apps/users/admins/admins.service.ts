import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.debug?.('AdminsService instantiated', AdminsService.name);
  }

  /**
   * Получение профиля администратора по ID пользователя
   */
  async getAdminProfile(userId: string) {
    this.logger.log(`Getting admin profile for user ${userId}`, AdminsService.name);

    const admin = await this.prisma.admin.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!admin) {
      throw new NotFoundException('Профиль администратора не найден');
    }

    return admin;
  }

  /**
   * Создание профиля администратора
   */
  async createAdminProfile(userId: string) {
    this.logger.log(`Creating admin profile for user ${userId}`, AdminsService.name);

    // Проверяем, что пользователь существует и имеет админскую роль
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      throw new BadRequestException('Пользователь не является администратором');
    }

    // Проверяем, что профиль еще не создан
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { userId }
    });

    if (existingAdmin) {
      throw new BadRequestException('Профиль администратора уже существует');
    }

    // Создаем профиль администратора
    const admin = await this.prisma.admin.create({
      data: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    this.logger.log(`Admin profile created with ID: ${admin.id}`, AdminsService.name);
    return admin;
  }
}
