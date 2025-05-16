import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, generateRandomPassword } from '../common/utils/password.utils';
import { ClientSortField, FindClientsDto, SortDirection, UpdateClientDto, CreateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // Метод для создания клиента администратором
  async createByAdmin(data: CreateClientDto) {
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

  /**
   * Поиск клиентов с пагинацией и фильтрацией
   */
  async findAll(queryParams: FindClientsDto) {
    const { 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = ClientSortField.CREATED_AT, 
      sortDirection = SortDirection.DESC 
    } = queryParams;

    // Базовые условия фильтрации
    const where: any = {};

    // Если есть поисковый запрос, добавляем условия поиска
    if (search) {
      where.OR = [
        // Поиск по имени
        {
          name: {
            contains: search,
            mode: 'insensitive',
          }
        },
        // Поиск по email пользователя
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            }
          }
        },
        // Поиск по телефонам
        {
          phones: {
            some: {
              phone: {
                contains: search,
              }
            }
          }
        }
      ];
    }

    // Вычисляем параметры пагинации
    const skip = (page - 1) * limit;

    // Настройка сортировки
    let orderBy: any = {};
    
    // В зависимости от выбранного поля сортировки
    switch (sortBy) {
      case ClientSortField.NAME:
        orderBy.name = sortDirection;
        break;
      case ClientSortField.EMAIL:
        orderBy.user = { email: sortDirection };
        break;
      case ClientSortField.CREATED_AT:
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    // Запрос на получение общего количества
    const totalCount = await this.prisma.client.count({ where });

    // Запрос на получение данных с пагинацией
    const clients = await this.prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

    // Возвращаем результат с мета-информацией
    return {
      data: clients,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  async update(id: string, data: UpdateClientDto) {
    try {
      const { phones, email, ...clientData } = data;
      
      // Получаем текущего клиента, чтобы узнать userId
      const client = await this.prisma.client.findUnique({
        where: { id },
        include: { user: true }
      });

      if (!client) {
        throw new NotFoundException(`Клиент с ID ${id} не найден`);
      }

      // Выполняем все операции в транзакции для обеспечения целостности данных
      return await this.prisma.$transaction(async (tx) => {
        // Если передан email, обновляем его в модели User
        if (email) {
          await tx.user.update({
            where: { id: client.userId },
            data: { email }
          });
        }

        // Если переданы телефоны, обрабатываем их отдельно
        if (phones && Array.isArray(phones)) {
          // 1. Удаляем все текущие телефоны
          await tx.clientPhone.deleteMany({
            where: { clientId: id }
          });
          
          // 2. Создаем новые телефоны (если массив не пустой)
          if (phones.length > 0) {
            await tx.clientPhone.createMany({
              data: phones.map(phone => ({
                phone: phone.toString(),
                clientId: id
              }))
            });
          }
        }
        
        // Обновляем остальные данные клиента
        return tx.client.update({
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
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при обновлении клиента:', error);
      throw new BadRequestException('Ошибка при обновлении клиента');
    }
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
  
  async removePhone(phoneId: string): Promise<{ id: string }> {
    // Удаляем телефон
    await this.prisma.clientPhone.delete({
      where: { id: phoneId }
    });
    
    // Возвращаем ID для RTK Query оптимистического обновления
    return { id: phoneId };
  }

  async remove(id: string) {
    return this.prisma.client.delete({
      where: { id },
    });
  }
} 