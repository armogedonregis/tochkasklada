import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { LoggerService } from '../logger/logger.service';
import { hashPassword } from '../common/utils/password.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UsersService instantiated', 'UsersService');
  }

  /**
   * Поиск пользователя по ID
   */
  async findOne(id: string) {
    this.logger.log(`Fetching user with id: ${id}`, 'UsersService');
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        client: true,
        admin: {
          select: {
            id: true,
            adminRoles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    rolePermissions: {
                      select: {
                        permission: {
                          select: {
                            key: true,
                            description: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!user) {
      this.logger.warn(`User with id: ${id} not found`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  /**
   * Поиск пользователя по email
   */
  async findByEmail(email: string) {
    this.logger.log(`Fetching user with email: ${email}`, 'UsersService');
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`User with email: ${email} not found`, 'UsersService');
      return null;
    }

    return user;
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating a new user with email: ${createUserDto.email}`, 'UsersService');

    const hashedPassword = await hashPassword(createUserDto.password);
    
    return this.prisma.$transaction(async (prisma) => {
      // Создаем пользователя с ролью ADMIN по умолчанию
      const user = await prisma.user.create({ 
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          role: 'ADMIN', // Роль по умолчанию
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Создаем запись в таблице admin
      const admin = await prisma.admin.create({
        data: {
          userId: user.id,
        },
      });
      this.logger.log(`Admin profile created for user id: ${user.id}`, 'UsersService');

      // Если указаны роли, назначаем их
      if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
        for (const roleId of createUserDto.roleIds) {
          await prisma.adminRole.create({
            data: {
              adminId: admin.id,
              roleId,
            },
          });
        }
        this.logger.log(`Roles assigned to user id: ${user.id}`, 'UsersService');
      }

      this.logger.log(`User created with id: ${user.id}`, 'UsersService');
      return user;
    });
  }
  
  /**
   * Создание клиента для пользователя
   */
  async createClient(userId: string, clientData: { name: string }) {
    this.logger.log(`Creating client for user id: ${userId}`, 'UsersService');
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${userId} not found, cannot create client`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Создаем клиента
    await this.prisma.client.create({ 
      data: {
        ...clientData,
        userId,
      },
    });

    this.logger.log(`Client created for user id: ${userId}`, 'UsersService');
    // Возвращаем обновленные данные пользователя
    return this.findOne(userId);
  }

  /**
   * Обновление пользователя
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`, 'UsersService');
    // Проверяем существование пользователя

    const hashedPassword = updateUserDto.password ? await hashPassword(updateUserDto.password) : undefined;

    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: {
        admin: {
          include: {
            adminRoles: {
              include: {
                role: true
              }
            }
          }
        }
      }
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${id} not found, cannot update`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    // Если пользователь не админ, не можем назначать роли
    if (updateUserDto.roleIds && existingUser.role !== 'ADMIN') {
      this.logger.warn(`Cannot assign roles to non-admin user with id: ${id}`, 'UsersService');
      throw new BadRequestException('Роли могут быть назначены только администраторам');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Обновляем основные данные пользователя
      const user = await prisma.user.update({
        where: { id },
        data: {
          email: updateUserDto.email,
          ...(updateUserDto.password && { password: hashedPassword }),
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Если есть roleIds и пользователь админ, обновляем роли
      if (updateUserDto.roleIds && existingUser.role === 'ADMIN' && existingUser.admin) {
        // Удаляем все существующие роли
        await prisma.adminRole.deleteMany({
          where: {
            adminId: existingUser.admin!.id
          }
        });

        // Добавляем новые роли
        if (updateUserDto.roleIds.length > 0) {
          await prisma.adminRole.createMany({
            data: updateUserDto.roleIds.map(roleId => ({
              adminId: existingUser.admin!.id,
              roleId
            }))
          });
        }

        this.logger.log(`Roles updated for admin user id: ${id}`, 'UsersService');
      }

      this.logger.log(`User with id: ${id} updated successfully`, 'UsersService');
      return user;
    });
  }

  /**
   * Удаление пользователя
   */
  async remove(id: string) {
    this.logger.log(`Removing user with id: ${id}`, 'UsersService');
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${id} not found, cannot remove`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const user = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User with id: ${id} removed successfully`, 'UsersService');
    return user;
  }

  /**
   * Получение всех пользователей
   */
  async findAll() {
    this.logger.log('Fetching all admin users', 'UsersService');
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'SUPERADMIN']
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        client: true,
        admin: {
          select: {
            id: true,
            adminRoles: {
              select: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    description: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return users;
  }
} 