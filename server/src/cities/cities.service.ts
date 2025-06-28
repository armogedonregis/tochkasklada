import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CitySortField, CreateCityDto, FindCitiesDto, SortDirection, UpdateCityDto } from './dto';
import { City, Location } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('CitiesService instantiated', 'CitiesService');
  }

  /**
   * Поиск городов с пагинацией и фильтрацией
   * Поддерживает поиск по названию города и короткому имени
   */
  async findCities(queryParams: FindCitiesDto) {
    this.logger.log(`Finding cities with query: ${JSON.stringify(queryParams)}`, 'CitiesService');
    try {
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
    } catch (error) {
      this.logger.error(`Failed to find cities: ${error.message}`, error.stack, 'CitiesService');
      throw new InternalServerErrorException('Ошибка при поиске городов');
    }
  }

  /**
   * Получение города по ID с его локациями
   */
  async findOne(id: string): Promise<City & { locations: Location[] }> {
    this.logger.log(`Fetching city with id: ${id}`, 'CitiesService');
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        locations: true,
      },
    });

    if (!city) {
      this.logger.warn(`City with id ${id} not found`, 'CitiesService');
      throw new NotFoundException(`Город с ID ${id} не найден`);
    }

    return city;
  }

  /**
   * Создание нового города
   */
  async create(createCityDto: CreateCityDto): Promise<City & { locations: Location[] }> {
    this.logger.log(`Creating new city with name: ${createCityDto.title}`, 'CitiesService');
    try {
      const newCity = await this.prisma.city.create({
        data: createCityDto,
        include: {
          locations: true,
        },
      });
      this.logger.log(`City created with id: ${newCity.id}`, 'CitiesService');
      return newCity;
    } catch (error) {
      this.logger.error(`Failed to create city: ${error.message}`, error.stack, 'CitiesService');
      throw new InternalServerErrorException('Ошибка при создании города');
    }
  }

  /**
   * Обновление существующего города
   */
  async update(id: string, updateCityDto: UpdateCityDto): Promise<City & { locations: any[] }> {
    this.logger.log(`Updating city with id: ${id}`, 'CitiesService');
    try {
      await this.findOne(id); // Проверка существования
      const updatedCity = await this.prisma.city.update({
        where: { id },
        data: updateCityDto,
        include: {
          locations: true,
        },
      });
      this.logger.log(`City with id ${id} updated successfully`, 'CitiesService');
      return updatedCity;
    } catch (error) {
      this.logger.error(`Failed to update city with id ${id}: ${error.message}`, error.stack, 'CitiesService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при обновлении города`);
    }
  }

  /**
   * Удаление города
   * @returns Объект с ID удаленного города для оптимистического обновления в RTK Query
   */
  async remove(id: string): Promise<{ id: string }> {
    this.logger.log(`Removing city with id: ${id}`, 'CitiesService');
    try {
      await this.findOne(id); // Проверка существования
      const deletedCity = await this.prisma.city.delete({
        where: { id },
      });
      this.logger.log(`City with id ${id} removed successfully`, 'CitiesService');
      return deletedCity;
    } catch (error) {
      this.logger.error(`Failed to remove city with id ${id}: ${error.message}`, error.stack, 'CitiesService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при удалении города`);
    }
  }
} 