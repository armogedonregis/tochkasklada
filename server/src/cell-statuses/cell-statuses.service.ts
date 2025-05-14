import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { CellStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellStatusDto, UpdateCellStatusDto } from './dto';

@Injectable()
export class CellStatusesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание нового статуса ячейки
   */
  async create(createCellStatusDto: CreateCellStatusDto): Promise<CellStatus> {
    try {
      return await this.prisma.cellStatus.create({
        data: createCellStatusDto,
      });
    } catch (error) {
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
    try {
      return await this.prisma.cellStatus.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении списка статусов ячеек: ${error.message}`);
    }
  }

  /**
   * Получение статуса ячейки по ID
   */
  async findOne(id: string): Promise<CellStatus> {
    try {
      const cellStatus = await this.prisma.cellStatus.findUnique({
        where: { id },
      });

      if (!cellStatus) {
        throw new NotFoundException(`Статус ячейки с ID ${id} не найден`);
      }

      return cellStatus;
    } catch (error) {
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
    try {
      // Проверяем существование статуса
      await this.findOne(id);
      
      return await this.prisma.cellStatus.update({
        where: { id },
        data: updateCellStatusDto,
      });
    } catch (error) {
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
    try {
      // Проверяем существование статуса
      await this.findOne(id);
      
      await this.prisma.cellStatus.delete({
        where: { id },
      });
    } catch (error) {
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