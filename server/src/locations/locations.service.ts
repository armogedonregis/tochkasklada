import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Location } from '@prisma/client';
import { 
  CreateLocationDto, 
  FindLocationsDto, 
  LocationSortField, 
  SortDirection, 
  UpdateLocationDto 
} from './dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Поиск локаций с пагинацией и фильтрацией
   * Поддерживает поиск по названию локации, адресу и городу
   */
  async findLocations(queryParams: FindLocationsDto) {
    const { 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = LocationSortField.CREATED_AT, 
      sortDirection = SortDirection.DESC 
    } = queryParams;

    // Базовые условия фильтрации
    let where: any = {};

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
      const locationConditions = [
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
  }

  async findOne(id: string) {
    const location = await this.prisma.location.findUnique({
      where: { id },
      include: {
        city: true,
        containers: true
      }
    });

    if (!location) {
      throw new NotFoundException(`Локация с ID ${id} не найдена`);
    }

    return location;
  }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.prisma.location.create({
      data: createLocationDto,
      include: {
        city: true,
      }
    });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    try {
      return await this.prisma.location.update({
        where: { id },
        data: updateLocationDto,
        include: {
          city: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Локация с ID ${id} не найдена`);
    }
  }

  async remove(id: string): Promise<{ id: string }> {
    try {
      await this.prisma.location.delete({
        where: { id },
      });
      
      // Возвращаем ID для RTK Query оптимистического обновления
      return { id };
    } catch (error) {
      throw new NotFoundException(`Локация с ID ${id} не найдена`);
    }
  }
} 