import { Injectable, NotFoundException } from '@nestjs/common';
import { Relay, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelaysService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.RelayCreateInput): Promise<Relay> {
    return this.prisma.relay.create({ data });
  }

  async findAll(): Promise<Relay[]> {
    return this.prisma.relay.findMany({ orderBy: { relayNumber: 'asc' } });
  }

  async findOne(id: string): Promise<Relay> {
    const relay = await this.prisma.relay.findUnique({ where: { id } });
    if (!relay) {
      throw new NotFoundException(`Relay with ID ${id} not found`);
    }
    return relay;
  }

  async update(id: string, data: Prisma.RelayUpdateInput): Promise<Relay> {
    try {
      return await this.prisma.relay.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new NotFoundException(`Relay with ID ${id} not found or could not be updated`);
    }
  }

  async toggle(id: string, state: boolean): Promise<void> {
    const relay = await this.prisma.relay.findUniqueOrThrow({
      where: { id },
      include: { panel: true },
    });

    if (!relay.panel.password) {
      throw new Error('Не указан пароль для панели');
    }

    // Формат из документации: http://[Логин]:[Пароль]@[IP адрес]/protect/rb[N]f.cgi
    const command = state ? 'n' : 'f'; // n - включить, f - выключить
    const url = `http://admin:${relay.panel.password}@${relay.panel.ipAddress}/protect/rb${relay.relayNumber}${command}.cgi`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Ошибка управления реле');
    }

    const data = await response.text();
    if (data !== 'Success!') {
      throw new Error('Ошибка управления реле');
    }
  }

  async pulse(id: string): Promise<void> {
    const relay = await this.prisma.relay.findUniqueOrThrow({
      where: { id },
      include: { panel: true },
    });

    if (!relay.panel.password) {
      throw new Error('Не указан пароль для панели');
    }

    const url = `http://admin:${relay.panel.password}@${relay.panel.ipAddress}/protect/rb${relay.relayNumber}s.cgi`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Ошибка отправки импульса');
    }

    const data = await response.text();
    if (data !== 'Success!') {
      throw new Error('Ошибка отправки импульса');
    }
  }

  async remove(id: string): Promise<void> {
    await this.prisma.relay.delete({ where: { id } });
  }
} 