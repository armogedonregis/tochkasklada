import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellStatusDto, UpdateCellStatusDto } from './dto';

@Injectable()
export class CellStatusesService {
  constructor(private prisma: PrismaService) {}

  async create(createCellStatusDto: CreateCellStatusDto) {
    return this.prisma.cellStatus.create({
      data: createCellStatusDto,
    });
  }

  async findAll() {
    return this.prisma.cellStatus.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const cellStatus = await this.prisma.cellStatus.findUnique({
      where: { id },
    });

    if (!cellStatus) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }

    return cellStatus;
  }

  async update(id: string, updateCellStatusDto: UpdateCellStatusDto) {
    try {
      return await this.prisma.cellStatus.update({
        where: { id },
        data: updateCellStatusDto,
      });
    } catch (error) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.cellStatus.delete({
        where: { id },
      });
      return { success: true, message: 'Статус ячейки успешно удален' };
    } catch (error) {
      throw new NotFoundException(`Статус с ID ${id} не найден`);
    }
  }
} 