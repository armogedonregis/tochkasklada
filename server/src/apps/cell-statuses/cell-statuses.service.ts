import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CellStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellStatusDto, UpdateCellStatusDto } from './dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CellStatusesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('CellStatusesService instantiated', 'CellStatusesService');
  }

  /**
   * Создание нового статуса ячейки
   */
  async create(createCellStatusDto: CreateCellStatusDto): Promise<CellStatus> {
    this.logger.log(`Creating new cell status with name: ${createCellStatusDto.name}`, 'CellStatusesService');
    try {
      const newStatus = await this.prisma.cellStatus.create({
        data: createCellStatusDto,
      });
      this.logger.log(`Cell status created with id: ${newStatus.id}`, 'CellStatusesService');
      return newStatus;
    } catch (error) {
      this.logger.error(`Failed to create cell status: ${error.message}`, error.stack, 'CellStatusesService');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Статус ячейки с таким именем уже существует');
        }
      }
      throw new InternalServerErrorException(`Ошибка при создании статуса ячейки: ${error.message}`);
    }
  }

  /**
   * Получение всех статусов ячеек
   */
  async findAll(): Promise<CellStatus[]> {
    this.logger.log('Fetching all cell statuses', 'CellStatusesService');
    try {
      return await this.prisma.cellStatus.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch all cell statuses: ${error.message}`, error.stack, 'CellStatusesService');
      throw new InternalServerErrorException(`Ошибка при получении списка статусов ячеек: ${error.message}`);
    }
  }

  /**
   * Получение статуса ячейки по ID
   */
  async findOne(id: string): Promise<CellStatus> {
    this.logger.log(`Fetching cell status with id: ${id}`, 'CellStatusesService');
    try {
      const cellStatus = await this.prisma.cellStatus.findUnique({
        where: { id },
      });

      if (!cellStatus) {
        this.logger.warn(`Cell status with id ${id} not found`, 'CellStatusesService');
        throw new NotFoundException(`Статус ячейки с ID ${id} не найден`);
      }

      return cellStatus;
    } catch (error) {
      this.logger.error(`Failed to fetch cell status with id ${id}: ${error.message}`, error.stack, 'CellStatusesService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при получении статуса ячейки: ${error.message}`);
    }
  }

  /**
   * Обновление статуса ячейки
   */
  async update(id: string, updateCellStatusDto: UpdateCellStatusDto): Promise<CellStatus> {
    this.logger.log(`Updating cell status with id: ${id}`, 'CellStatusesService');
    try {
      // Проверяем существование статуса
      await this.findOne(id);
      
      const updatedStatus = await this.prisma.cellStatus.update({
        where: { id },
        data: updateCellStatusDto,
      });
      this.logger.log(`Cell status with id ${id} updated successfully`, 'CellStatusesService');
      return updatedStatus;
    } catch (error) {
      this.logger.error(`Failed to update cell status with id ${id}: ${error.message}`, error.stack, 'CellStatusesService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Статус ячейки с таким именем уже существует');
        }
      }
      throw new InternalServerErrorException(`Ошибка при обновлении статуса ячейки: ${error.message}`);
    }
  }

  /**
   * Удаление статуса ячейки
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Removing cell status with id: ${id}`, 'CellStatusesService');
    try {
      // Проверяем существование статуса
      await this.findOne(id);
      
      await this.prisma.cellStatus.delete({
        where: { id },
      });
      this.logger.log(`Cell status with id ${id} removed successfully`, 'CellStatusesService');
    } catch (error) {
      this.logger.error(`Failed to remove cell status with id ${id}: ${error.message}`, error.stack, 'CellStatusesService');
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException('Невозможно удалить статус, так как он используется в ячейках');
        }
      }
      throw new InternalServerErrorException(`Ошибка при удалении статуса ячейки: ${error.message}`);
    }
  }
} 