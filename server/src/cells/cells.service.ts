import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

@Injectable()
export class CellsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cells.findMany({
      include: {
        container: true,
        size: true,
        status: true
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.cells.findUnique({
      where: { id },
      include: {
        container: true,
        size: true,
        status: true
      }
    });
  }

  async create(createCellDto: CreateCellDto) {
    return this.prisma.cells.create({
      data: createCellDto,
      include: {
        status: true
      }
    });
  }

  async update(id: string, updateCellDto: UpdateCellDto) {
    return this.prisma.cells.update({
      where: { id },
      data: updateCellDto,
      include: {
        status: true
      }
    });
  }

  async remove(id: string) {
    return this.prisma.cells.delete({
      where: { id },
    });
  }

  async findByContainer(containerId: number) {
    return this.prisma.cells.findMany({
      where: { containerId },
      include: {
        size: true,
        status: true
      }
    });
  }

  async findBySize(sizeId: string) {
    return this.prisma.cells.findMany({
      where: { size_id: sizeId },
      include: {
        container: true,
        status: true
      }
    });
  }
} 