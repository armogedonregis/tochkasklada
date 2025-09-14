import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { Location, Prisma } from '@prisma/client';
import { 
  CreateLocationDto, 
  FindLocationsDto, 
  LocationSortField, 
  SortDirection, 
  UpdateLocationDto 
} from './dto';
import { LoggerService } from '../logger/logger.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class LocationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
    private readonly rolesService: RolesService,
  ) {
    this.logger.log('LocationsService instantiated', 'LocationsService');
  }

  /**
   * Поиск локаций с пагинацией и фильтрацией
   * Поддерживает поиск по названию локации, адресу и городу
   */
  async findLocations(queryParams: FindLocationsDto, currentUser?: { id: string; role: string }) {
    this.logger.log(`Finding locations with query: ${JSON.stringify(queryParams)}`, 'LocationsService');
    try {
      const { 
        search, 
        page = 1, 
        limit = 10, 
        sortBy = LocationSortField.CREATED_AT, 
        sortDirection = SortDirection.DESC 
      } = queryParams;

      // Базовые условия фильтрации
      let where: Prisma.LocationWhereInput = {};

      // Если есть поисковый запрос, добавляем условия поиска
      if (search) {
        // Поиск городов, соответствующих запросу
        const citiesMatching = await this.prisma.city.findMany({
          where: {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { short_name: { contains: search, mode: 'insensitive' } }
            ]
          },
          select: { id: true }
        });

        // Собираем ID найденных городов
        const cityIds = citiesMatching.map(city => city.id);

        // Условия поиска по полям локации
        const locationConditions: Prisma.LocationWhereInput[] = [
          // Поиск по названию
          {
            name: {
              contains: search,
              mode: 'insensitive',
            }
          },
          // Поиск по короткому имени
          {
            short_name: {
              contains: search,
              mode: 'insensitive',
            }
          },
          // Поиск по адресу
          {
            address: {
              contains: search,
              mode: 'insensitive',
            }
          }
        ];
        
        // Если найдены подходящие города, добавляем условие поиска по их ID
        if (cityIds.length > 0) {
          where = {
            OR: [
              ...locationConditions,
              { cityId: { in: cityIds } }
            ]
          };
        } else {
          // Иначе ищем только по полям локации
          where.OR = locationConditions;
        }
      }

      // Фильтрация по доступным локациям для ADMIN
      if (currentUser && currentUser.role === 'ADMIN') {
        const admin = await this.prisma.admin.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
        if (admin) {
          const accessibleLocationIds = await this.rolesService.getAccessibleLocationIdsForAdmin(admin.id);
          if (accessibleLocationIds.length === 0) {
            return { data: [], meta: { totalCount: 0, page, limit, totalPages: 0 } } as any;
          }
          
          // Ограничиваем выдачу только доступными локациями
          if (where.OR) {
            // Если уже есть OR условия (поиск), добавляем дополнительное условие через AND
            where = {
              AND: [
                where,
                { id: { in: accessibleLocationIds } }
              ]
            };
          } else {
            // Если нет поисковых условий, просто ограничиваем по ID
            where.id = { in: accessibleLocationIds };
          }
        }
      }

      // Вычисляем параметры пагинации
      const skip = (page - 1) * limit;

      // Настройка сортировки
      let orderBy: any = {};
      
      // В зависимости от выбранного поля сортировки
      switch (sortBy) {
        case LocationSortField.NAME:
          orderBy.name = sortDirection;
          break;
        case LocationSortField.SHORT_NAME:
          orderBy.short_name = sortDirection;
          break;
        case LocationSortField.CITY:
          orderBy.city = { title: sortDirection };
          break;
        case LocationSortField.CREATED_AT:
        default:
          orderBy.createdAt = sortDirection;
          break;
      }

      // Запрос на получение общего количества
      const totalCount = await this.prisma.location.count({ where });

      // Запрос на получение данных с пагинацией
      const locations = await this.prisma.location.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          city: true,
        },
      });

      // Рассчитываем количество страниц
      const totalPages = Math.ceil(totalCount / limit);

      // Возвращаем результат с мета-информацией
      return {
        data: locations,
        meta: {
          totalCount,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to find locations: ${error.message}`, error.stack, 'LocationsService');
      throw new InternalServerErrorException('Ошибка при поиске локаций');
    }
  }

  async findOne(id: string) {
    this.logger.log(`Fetching location with id: ${id}`, 'LocationsService');
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        city: true,
        containers: true
      }
    });

    if (!location) {
      this.logger.warn(`Location with id ${id} not found`, 'LocationsService');
      throw new NotFoundException(`Локация с ID ${id} не найдена`);
    }

    return location;
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating new location with name: ${createLocationDto.name}`, 'LocationsService');
    try {
      const newLocation = await this.prisma.location.create({
        data: createLocationDto,
        include: {
          city: true,
        }
      });
      this.logger.log(`Location created with id: ${newLocation.id}`, 'LocationsService');
      return newLocation;
    } catch (error) {
      this.logger.error(`Failed to create location: ${error.message}`, error.stack, 'LocationsService');
      throw new InternalServerErrorException('Ошибка при создании локации');
    }
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Updating location with id: ${id}`, 'LocationsService');
    try {
      await this.findOne(id); // Проверка существования
      const updatedLocation = await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
        include: {
          city: true,
        },
      });
      this.logger.log(`Location with id ${id} updated successfully`, 'LocationsService');
      return updatedLocation;
    } catch (error) {
      this.logger.error(`Failed to update location with id ${id}: ${error.message}`, error.stack, 'LocationsService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при обновлении локации`);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    this.logger.log(`Removing location with id: ${id}`, 'LocationsService');
    try {
      await this.findOne(id); // Проверка существования
      await this.prisma.location.delete({
        where: { id },
      });
      
      this.logger.log(`Location with id ${id} removed successfully`, 'LocationsService');
      return { id };
    } catch (error) {
      this.logger.error(`Failed to remove location with id ${id}: ${error.message}`, error.stack, 'LocationsService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при удалении локации`);
    }
  }
} 