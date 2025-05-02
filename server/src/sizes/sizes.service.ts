import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sizeCells.findMany();
  }

  async findOne(id: string) {
    return this.prisma.sizeCells.findUnique({
      where: { id },
    });
  }

  async create(createSizeDto: CreateSizeDto) {
    return this.prisma.sizeCells.create({
      data: createSizeDto,
    });
  }

  async update(id: string, updateSizeDto: UpdateSizeDto) {
    return this.prisma.sizeCells.update({
      where: { id },
      data: updateSizeDto,
    });
  }

  async remove(id: string) {
    return this.prisma.sizeCells.delete({
      where: { id },
    });
  }
} 