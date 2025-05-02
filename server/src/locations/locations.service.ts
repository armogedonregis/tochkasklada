import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.location.findMany({
      include: {
        city: true,
      }
    });
  }

  async findOne(id: string) {
    return this.prisma.location.findUnique({
      where: { id },
      include: {
        city: true,
        containers: true
      }
    });
  }

  async create(createLocationDto: CreateLocationDto) {
    return this.prisma.location.create({
      data: createLocationDto,
    });
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    return this.prisma.location.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.location.delete({
      where: { id },
    });
  }

  async findByShortName(shortName: string) {
    return this.prisma.location.findFirst({
      where: { short_name: shortName },
      include: {
        city: true,
        containers: true
      }
    });
  }

  async findByCity(cityId: string) {
    return this.prisma.location.findMany({
      where: { cityId },
      include: {
        containers: true
      }
    });
  }
} 