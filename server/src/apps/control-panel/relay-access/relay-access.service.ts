import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { RelayAccess, Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CreateRelayAccessDto, CheckRelayAccessDto, FindRelayAccessDto, RelayAccessSortField, SortDirection } from './dto';

@Injectable()
export class RelayAccessService {
  constructor(private prisma: PrismaService) {}

  /**
   * Предоставление доступа к реле
   */
  async grantAccess(createDto: CreateRelayAccessDto): Promise<RelayAccess> {
    try {
      // Проверяем существование реле
      const relay = await this.prisma.relay.findUnique({
        where: { id: createDto.relayId }
      });
      
      if (!relay) {
        throw new NotFoundException(`Реле с ID ${createDto.relayId} не найдено`);
      }

      // Проверяем существование аренды ячейки, если указана
      if (createDto.cellRentalId) {
        const cellRental = await this.prisma.cellRental.findUnique({
          where: { id: createDto.cellRentalId }
        });
        
        if (!cellRental) {
          throw new NotFoundException(`Аренда ячейки с ID ${createDto.cellRentalId} не найдена`);
        }
      }

      // Создаем доступ
      return await this.prisma.relayAccess.create({
        data: {
          relay: { connect: { id: createDto.relayId } },
          ...(createDto.cellRentalId && {
            cellRental: { connect: { id: createDto.cellRentalId } }
          }),
          validUntil: createDto.validUntil,
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Доступ к реле уже существует');
        }
      }
      
      throw new InternalServerErrorException(`Ошибка при предоставлении доступа: ${error.message}`);
    }
  }

  /**
   * Проверка доступа к реле для аренды ячейки
   */
  async checkAccess(cellRentalId: string, relayId: string): Promise<boolean> {
    try {
      const access = await this.prisma.relayAccess.findFirst({
        where: {
          relayId,
          cellRentalId,
          validUntil: {
            gt: new Date(),
          },
        },
      });
      
      return !!access;
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при проверке доступа: ${error.message}`);
    }
  }

  /**
   * Получение всех записей доступа к реле с пагинацией и фильтрацией
   */
  async findAll(queryParams: FindRelayAccessDto) {
    try {
      const {
        search,
        page = 1,
        limit = 10,
        sortBy = RelayAccessSortField.CREATED_AT,
        sortDirection = SortDirection.DESC
      } = queryParams;

      // Базовые условия фильтрации
      let where: Prisma.RelayAccessWhereInput = {};

      // Если указана поисковая строка, строим условие для поиска
      if (search) {
        where.OR = [
          // Поиск по ID реле
          {
            relay: {
              id: { contains: search }
            }
          },
          // Поиск по ID аренды ячейки
          {
            cellRental: {
              id: { contains: search }
            }
          }
        ];
      }

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: Prisma.RelayAccessOrderByWithRelationInput = {};
      
      // В зависимости от выбранного поля сортировки
      switch (sortBy) {
        case RelayAccessSortField.VALID_UNTIL:
          orderBy.validUntil = sortDirection;
          break;
        case RelayAccessSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      // Запрос на получение общего количества
      const totalCount = await this.prisma.relayAccess.count({ where });

      // Запрос на получение данных с пагинацией
      const relayAccess = await this.prisma.relayAccess.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          relay: {
            include: {
              panel: true
            }
          },
          cellRental: true
        }
      });

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      // Возвращаем результат с мета-информацией
      return {
        data: relayAccess,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении списка доступов: ${error.message}`);
    }
  }

  /**
   * Получение доступов для конкретной аренды ячейки
   */
  async findByRental(cellRentalId: string): Promise<RelayAccess[]> {
    try {
      // Проверяем существование аренды ячейки
      const cellRental = await this.prisma.cellRental.findUnique({
        where: { id: cellRentalId }
      });
      
      if (!cellRental) {
        throw new NotFoundException(`Аренда ячейки с ID ${cellRentalId} не найдена`);
      }

      return await this.prisma.relayAccess.findMany({
        where: {
          cellRentalId,
          validUntil: {
            gt: new Date(),
          },
        },
        include: {
          relay: {
            include: {
              panel: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при получении доступов для аренды: ${error.message}`);
    }
  }

  /**
   * Отзыв доступа к реле
   */
  async revokeAccess(id: string): Promise<void> {
    try {
      // Проверяем существование доступа
      const access = await this.prisma.relayAccess.findUnique({
        where: { id }
      });
      
      if (!access) {
        throw new NotFoundException(`Доступ с ID ${id} не найден`);
      }
      
      await this.prisma.relayAccess.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при отзыве доступа: ${error.message}`);
    }
  }
} 