import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';

@Injectable()
export class ContainersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.containers.findMany({
      include: {
        location: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.containers.findUnique({
      where: { id },
      include: {
        location: true,
        cells: true
      }
    });
  }

  async create(createContainerDto: CreateContainerDto) {
    return this.prisma.containers.create({
      data: createContainerDto,
    });
  }

  async update(id: number, updateContainerDto: UpdateContainerDto) {
    return this.prisma.containers.update({
      where: { id },
      data: updateContainerDto,
    });
  }

  async remove(id: number) {
    return this.prisma.containers.delete({
      where: { id },
    });
  }

  async findByLocation(locId: string) {
    return this.prisma.containers.findMany({
      where: { locId },
      include: {
        cells: true
      }
    });
  }
} 