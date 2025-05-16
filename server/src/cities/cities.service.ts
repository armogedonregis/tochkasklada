import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CitySortField, CreateCityDto, FindCitiesDto, SortDirection, UpdateCityDto } from './dto';
import { City } from '@prisma/client';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Поиск городов с пагинацией и фильтрацией
   * Поддерживает поиск по названию города и короткому имени
   */
  async findCities(queryParams: FindCitiesDto) {
    const { 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = CitySortField.CREATED_AT, 
      sortDirection = SortDirection.DESC 
    } = queryParams;

    // Базовые условия фильтрации
    const where: any = {};

    // Если есть поисковый запрос, добавляем условия поиска
    if (search) {
      where.OR = [
        // Поиск по названию
        {
          title: {
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
        }
      ];
    }

    // Вычисляем параметры пагинации
    const skip = (page - 1) * limit;

    // Настройка сортировки
    let orderBy: any = {};
    
    // В зависимости от выбранного поля сортировки
    switch (sortBy) {
      case CitySortField.TITLE:
        orderBy.title = sortDirection;
        break;
      case CitySortField.SHORT_NAME:
        orderBy.short_name = sortDirection;
        break;
      case CitySortField.CREATED_AT:
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    // Запрос на получение общего количества
    const totalCount = await this.prisma.city.count({ where });

    // Запрос на получение данных с пагинацией
    const cities = await this.prisma.city.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

    // Возвращаем результат с мета-информацией
    return {
      data: cities,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Получение города по ID с его локациями
   */
  async findOne(id: string): Promise<City & { locations: any[] }> {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        locations: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }

    return city;
  }

  /**
   * Создание нового города
   */
  async create(createCityDto: CreateCityDto): Promise<City & { locations: any[] }> {
    return this.prisma.city.create({
      data: createCityDto,
      include: {
        locations: true,
      },
    });
  }

  /**
   * Обновление существующего города
   */
  async update(id: string, updateCityDto: UpdateCityDto): Promise<City & { locations: any[] }> {
    try {
      return await this.prisma.city.update({
        where: { id },
        data: updateCityDto,
        include: {
          locations: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }
  }

  /**
   * Удаление города
   * @returns Объект с ID удаленного города для оптимистического обновления в RTK Query
   */
  async remove(id: string): Promise<{ id: string }> {
    try {
      await this.prisma.city.delete({
        where: { id },
      });
      
      // Возвращаем ID для RTK Query оптимистического обновления
      return { id };
    } catch (error) {
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }
  }
} 