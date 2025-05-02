import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, generateRandomPassword } from '../common/utils/password.utils';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const { phones, ...clientData } = data;
    
    return this.prisma.client.create({
      data: {
        ...clientData,
        phones: phones ? {
          create: Array.isArray(phones) 
            ? phones.map(phone => ({ phone }))
            : [{ phone: phones }]
        } : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        phones: true,
      },
    });
  }

  // Метод для создания клиента администратором
  async createByAdmin(data: { name: string; email: string; password?: string; phones?: string[]; company?: string }) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException(`Пользователь с email ${data.email} уже существует`);
    }

    // Создаем пароль: используем переданный или генерируем новый
    const password = data.password || generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    // Транзакция для создания пользователя и клиента
    const result = await this.prisma.$transaction(async (tx) => {
      // Создаем пользователя
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'CLIENT',
        },
      });

      // Создаем клиента
      const newClient = await tx.client.create({
        data: {
          name: data.name,
          userId: newUser.id,
          phones: data.phones && data.phones.length > 0 ? {
            create: data.phones.map(phone => ({ phone }))
          } : undefined
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            }
          },
          phones: true,
        },
      });

      return {
        ...newClient,
        generatedPassword: data.password ? undefined : password
      };
    });

    return result;
  }

  // Метод для создания клиента из формы лендинга
  async createFromLanding(data: { name: string, email: string, phone: string }) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        client: {
          include: {
            phones: true,
          }
        },
      },
    });

    // Если пользователь уже существует, возвращаем его клиента (если он есть)
    if (existingUser) {
      if (existingUser.client) {
        // Проверяем, есть ли такой телефон у клиента
        const hasPhone = existingUser.client.phones.some(
          p => p.phone === data.phone
        );
        
        // Транзакция для обновления
        return this.prisma.$transaction(async (tx) => {
          // Если нет такого телефона, добавляем
          if (!hasPhone && data.phone && existingUser.client) {
            await tx.clientPhone.create({
              data: {
                phone: data.phone,
                clientId: existingUser.client.id,
              }
            });
          }
          
          // Обновляем данные клиента (имя могло измениться)
          const updatedClient = await tx.client.update({
            where: { id: existingUser.client ? existingUser.client.id : '' },
            data: {
              name: data.name,
            },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                }
              },
              phones: true,
            },
          });
          
          return updatedClient;
        });
      } else {
        // Если есть пользователь, но нет клиента, создаем клиента
        return this.prisma.client.create({
          data: {
            name: data.name,
            userId: existingUser.id,
            phones: {
              create: data.phone ? [{
                phone: data.phone
              }] : []
            }
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              }
            },
            phones: true,
          },
        });
      }
    }

    // Создаем временный пароль для нового пользователя
    const tempPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword);

    // Создаем нового пользователя и клиента в транзакции
    return this.prisma.$transaction(async (tx) => {
      // Создаем пользователя
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'CLIENT',
        },
      });

      // Создаем клиента с телефоном
      const newClient = await tx.client.create({
        data: {
          name: data.name,
          userId: newUser.id,
          phones: {
            create: data.phone ? [{
              phone: data.phone
            }] : []
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            }
          },
          phones: true,
        },
      });

      // Здесь можно добавить отправку письма с временным паролем

      return {
        ...newClient,
        tempPassword, // В реальном приложении это должно отправляться по email, а не возвращаться в API
      };
    });
  }

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        phones: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        phones: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.client.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        phones: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        client: {
          include: {
            phones: true,
          }
        },
      },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.clientPhone.findFirst({
      where: { phone },
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              }
            },
            phones: true,
          }
        },
      },
    });
  }

  async update(id: string, data: any) {
    const { phones, ...clientData } = data;
    
    // Если переданы телефоны, обрабатываем их отдельно
    if (phones) {
      // Для простоты удаляем все текущие телефоны и создаем новые
      // В реальном приложении можно сделать более сложную логику обновления
      await this.prisma.clientPhone.deleteMany({
        where: { clientId: id }
      });
      
      // Создаем новые телефоны
      if (Array.isArray(phones) && phones.length > 0) {
        await this.prisma.clientPhone.createMany({
          data: phones.map(phone => ({
            phone,
            clientId: id
          }))
        });
      } else if (typeof phones === 'string') {
        await this.prisma.clientPhone.create({
          data: {
            phone: phones,
            clientId: id
          }
        });
      }
    }
    
    // Обновляем остальные данные клиента
    return this.prisma.client.update({
      where: { id },
      data: clientData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        phones: true,
      },
    });
  }

  async addPhone(clientId: string, phone: string) {
    // Добавляем новый телефон
    return this.prisma.clientPhone.create({
      data: {
        phone,
        clientId
      }
    });
  }
  
  async removePhone(phoneId: string) {
    // Удаляем телефон
    await this.prisma.clientPhone.delete({
      where: { id: phoneId }
    });
    
    return { success: true };
  }

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
} 