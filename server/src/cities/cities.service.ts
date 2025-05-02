import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.city.findMany({
      include: {
        locations: true,
      },
    });
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        locations: true,
      },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return city;
  }

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: createCityDto,
      include: {
        locations: true,
      },
    });
  }

  async update(id: string, updateCityDto: UpdateCityDto) {
    try {
      return await this.prisma.city.update({
        where: { id },
        data: updateCityDto,
        include: {
          locations: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.city.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
  }
} 