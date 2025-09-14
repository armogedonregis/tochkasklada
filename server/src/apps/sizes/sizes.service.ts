import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeDto, UpdateSizeDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Получение всех размеров ячеек
   */
  async findSizes() {
    try {
      const sizes = await this.prisma.sizeCells.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return sizes;
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при получении размеров ячеек: ${error.message}`);
    }
  }

  /**
   * Получение размера ячейки по ID
   */
  async findOne(id: string) {
    try {
      const size = await this.prisma.sizeCells.findUnique({
        where: { id }
      });

      if (!size) {
        throw new NotFoundException(`Размер ячейки с ID ${id} не найден`);
      }

      return size;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при получении размера ячейки: ${error.message}`);
    }
  }

  /**
   * Поиск размера ячейки по короткому имени (внутренний метод)
   * @private
   */
  private async findByShortName(shortName: string) {
    try {
      return await this.prisma.sizeCells.findUnique({
        where: { short_name: shortName }
      });
    } catch (error) {
      throw new InternalServerErrorException(`Ошибка при поиске размера ячейки: ${error.message}`);
    }
  }

  /**
   * Создание нового размера ячейки
   */
  async create(createSizeDto: CreateSizeDto) {
    try {
      // Проверяем, существует ли уже размер с таким коротким именем
      const existingSize = await this.findByShortName(createSizeDto.short_name);
      if (existingSize) {
        throw new ConflictException(`Размер ячейки с коротким именем ${createSizeDto.short_name} уже существует`);
      }

      return await this.prisma.sizeCells.create({
        data: createSizeDto
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Размер ячейки с таким коротким именем уже существует');
        }
      }
      throw new InternalServerErrorException(`Ошибка при создании размера ячейки: ${error.message}`);
    }
  }

  /**
   * Обновление размера ячейки
   */
  async update(id: string, updateSizeDto: UpdateSizeDto) {
    try {
      // Проверяем существование обновляемого размера
      await this.findOne(id);

      // Проверяем, не занято ли короткое имя другим размером
      if (updateSizeDto.short_name) {
        const existingSize = await this.findByShortName(updateSizeDto.short_name);
        if (existingSize && existingSize.id !== id) {
          throw new ConflictException(`Размер ячейки с коротким именем ${updateSizeDto.short_name} уже существует`);
        }
      }

      return await this.prisma.sizeCells.update({
        where: { id },
        data: updateSizeDto
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Размер ячейки с таким коротким именем уже существует');
        }
      }
      throw new InternalServerErrorException(`Ошибка при обновлении размера ячейки: ${error.message}`);
    }
  }

  /**
   * Удаление размера ячейки
   */
  async remove(id: string) {
    try {
      // Проверяем существование размера
      await this.findOne(id);
      
      // Проверяем, используется ли размер какими-либо ячейками
      const cellsWithSize = await this.prisma.cells.findMany({
        where: { size_id: id },
        take: 1
      });
      
      if (cellsWithSize.length > 0) {
        throw new ConflictException('Нельзя удалить размер, который используется ячейками');
      }

      return await this.prisma.sizeCells.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new ConflictException('Нельзя удалить размер, который используется ячейками');
        }
      }
      
      throw new InternalServerErrorException(`Ошибка при удалении размера ячейки: ${error.message}`);
    }
  }
} 