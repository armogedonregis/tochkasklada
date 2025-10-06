import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { hashPassword, generateRandomPassword } from '@/common/utils/password.utils';
import { ClientSortField, FindClientsDto, SortDirection, UpdateClientDto, CreateClientDto } from './dto';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { RolesService } from '@/apps/roles/roles.service';
import { MailService } from '@/infrastructure/mail/mail.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
  ) {
    this.logger.log('ClientsService instantiated', 'ClientsService');
  }

  // Метод для создания клиента администратором
  async createByAdmin(data: CreateClientDto) {
    this.logger.log(`Admin creating client with email: ${data.email}`, 'ClientsService');
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      this.logger.warn(`User with email ${data.email} already exists`, 'ClientsService');
      throw new BadRequestException(`Пользователь с email ${data.email} уже существует`);
    }

    // Создаем пароль: используем переданный или генерируем новый
    const password = data.password || generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    this.logger.log(`Creating user and client in transaction for email: ${data.email}`, 'ClientsService');
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
            create: data.phones.map(phone => ({ 
              phone: phone.phone,
              comment: phone.comment 
            }))
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

    this.logger.log(`Client created successfully for email: ${data.email}`, 'ClientsService');
    return result;
  }

  // Метод для создания клиента из формы лендинга
  async createFromLanding(data: { name: string, email: string, phone: string }) {
    this.logger.log(`Creating client from landing page for email: ${data.email}`, 'ClientsService');
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
      this.logger.log(`User ${data.email} already exists. Updating client info.`, 'ClientsService');
      if (existingUser.client) {
        // Проверяем, есть ли такой телефон у клиента
        const hasPhone = existingUser.client.phones.some(
          p => p.phone === data.phone
        );
        
        const clientId = existingUser.client.id; // Сохраняем ID в переменную

        // Транзакция для обновления
        return this.prisma.$transaction(async (tx) => {
          // Если нет такого телефона, добавляем
          if (!hasPhone && data.phone) {
            this.logger.log(`Adding new phone ${data.phone} to client ${clientId}`, 'ClientsService');
            await tx.clientPhone.create({
              data: {
                phone: data.phone,
                clientId: clientId,
              }
            });
          }
          
          // Обновляем данные клиента (имя могло измениться)
          this.logger.log(`Updating client name for ${clientId}`, 'ClientsService');
          const updatedClient = await tx.client.update({
            where: { id: clientId },
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
        this.logger.log(`User ${data.email} exists, but has no client profile. Creating one.`, 'ClientsService');
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

    this.logger.log(`Creating new user and client from landing for email: ${data.email}`, 'ClientsService');
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
    this.logger.log(`Fetching client with id: ${id}`, 'ClientsService');
    const client = this.prisma.client.findUnique({
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
    if (!client) this.logger.warn(`Client with id ${id} not found`, 'ClientsService');
    return client;
  }

  async findByUserId(userId: string) {
    this.logger.log(`Fetching client with user id: ${userId}`, 'ClientsService');
    const client = this.prisma.client.findUnique({
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
    if (!client) this.logger.warn(`Client with user id ${userId} not found`, 'ClientsService');
    return client;
  }

  /**
   * Поиск клиентов с пагинацией и фильтрацией
   */
  async findAll(queryParams: FindClientsDto, currentUser?: { id: string; role: string }) {
    this.logger.log(`Fetching all clients with query params: ${JSON.stringify(queryParams)}`, 'ClientsService');
    const { 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = ClientSortField.CREATED_AT, 
      sortDirection = SortDirection.DESC
    } = queryParams;

    // Базовые условия фильтрации
    const where: any = {};

    // Проверяем все клиенты в базе для отладки
    const allClients = await this.prisma.client.findMany({
      select: {
        id: true,
        name: true,
      }
    });
    this.logger.log(`All clients in database: ${JSON.stringify(allClients)}`, 'ClientsService');

    // Если есть поисковый запрос, добавляем условия поиска
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            }
          }
        },
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

    // Фильтрация по доступным локациям для ADMIN (через активные аренды клиента)
    if (currentUser && currentUser.role === 'ADMIN') {
      const admin = await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
      const ids = admin ? await this.rolesService.getAccessibleLocationIdsForAdmin(admin.id) : [];
      if (ids.length > 0) {
        where.AND = where.AND || [];
        where.AND.push({
          rentals: {
            some: {
              cell: {
                some: {
                  container: { location: { id: { in: ids } } }
                }
              }
            }
          }
        });
      } else {
        this.logger.log('Admin has no accessible locations, returning empty clients list', 'ClientsService');
        return { data: [], meta: { totalCount: 0, page, limit, totalPages: 0 } } as any;
      }
    }

    this.logger.log(`Final where conditions: ${JSON.stringify(where)}`, 'ClientsService');

    // Запрос на получение данных с пагинацией
    const clients = await this.prisma.client.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: this.getOrderBy(sortBy, sortDirection),
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

    this.logger.log(`Found ${clients.length} clients with filter`, 'ClientsService');
    this.logger.log(`Filtered clients: ${JSON.stringify(clients.map(c => ({ id: c.id, name: c.name })))}`, 'ClientsService');

    // Запрос на получение общего количества с учетом фильтров
    const totalCount = await this.prisma.client.count({ where });

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

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

  private getOrderBy(sortBy: ClientSortField, sortDirection: SortDirection) {
    switch (sortBy) {
      case ClientSortField.NAME:
        return { name: sortDirection };
      case ClientSortField.EMAIL:
        return { user: { email: sortDirection } };
      case ClientSortField.CREATED_AT:
      default:
        return { createdAt: sortDirection };
    }
  }

  /**
   * Обновление данных клиента, включая пользователя и телефоны.
   * @param id - ID клиента
   * @param data - DTO с данными для обновления
   */
  async update(id: string, data: UpdateClientDto) {
    this.logger.log(`Updating client with id: ${id}`, 'ClientsService');
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
          this.logger.log(`Updating user email for client id: ${id}`, 'ClientsService');
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
                phone: phone.phone,
                comment: phone.comment,
                clientId: id
              }))
            });
          }
        }
        
        // Обновляем остальные данные клиента
        this.logger.log(`Updating client name for id: ${id}`, 'ClientsService');
        const updatedClient = await tx.client.update({
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

        this.logger.log(`Client with id: ${id} updated successfully. Fetching updated data.`, 'ClientsService');
        return updatedClient;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Ошибка при обновлении клиента:', error);
      throw new BadRequestException('Ошибка при обновлении клиента');
    }
  }

  async addPhone(clientId: string, phone: string, comment?: string) {
    this.logger.log(`Adding phone to client id: ${clientId}`, 'ClientsService');
    return this.prisma.clientPhone.create({
      data: {
        clientId,
        phone,
        comment,
      },
    });
  }
  
  async removePhone(phoneId: string): Promise<{ id: string }> {
    this.logger.log(`Removing phone with id: ${phoneId}`, 'ClientsService');
    await this.prisma.clientPhone.delete({
      where: { id: phoneId },
    });
    return { id: phoneId };
  }

  async remove(id: string) {
    this.logger.log(`Removing client with id: ${id}`, 'ClientsService');
    // Начинаем транзакцию
    return this.prisma.$transaction(async (tx) => {
      // Находим клиента, чтобы получить userId
      const client = await tx.client.findUnique({ where: { id } });
      if (!client) {
        this.logger.warn(`Client with id ${id} not found for removal`, 'ClientsService');
        throw new NotFoundException(`Клиент с ID ${id} не найден`);
      }
      const userId = client.userId;

      // 1. Удаляем связанные записи (телефоны, аренды и т.д.)
      // Prisma позаботится об этом через каскадное удаление, если настроено
      // Но телефоны удалим вручную для надежности
      await tx.clientPhone.deleteMany({ where: { clientId: id } });

      // 2. Удаляем самого клиента
      await tx.client.delete({ where: { id } });

      // 3. Удаляем связанного пользователя
      if (userId) {
        await tx.user.delete({ where: { id: userId } });
      }

      this.logger.log(`Client with id ${id} and associated user removed successfully`, 'ClientsService');
      return { id };
    });
  }


  async sendEmailRental(clientId: string) {
    const rental = await this.prisma.cellRental.findFirst({
      where: { clientId: clientId },
      include: {
        cell: {
          include: { container: true }
        }
      }
    });

    const user = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { user: { select: { email: true } }, name: true }
    });

    if(!user) {
      this.logger.warn(`User with id ${clientId} not found`, 'ClientsService');
      throw new NotFoundException(`Пользователь с ID ${clientId} не найден`);
    }

    if(!rental) {
      this.logger.warn(`Rental with client id ${clientId} not found`, 'ClientsService');
      throw new NotFoundException(`Аренда с ID ${clientId} не найдена`);
    }

    const daysLeft = Math.ceil((new Date(rental.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const expirationDate = rental.endDate.toLocaleDateString('ru-RU').toString();

    return this.mailService.sendRentalExpirationNotification(user.user.email, user.name, daysLeft, rental.cell[0].name, expirationDate);
  }
} 