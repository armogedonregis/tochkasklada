import { Injectable, NotFoundException } from '@nestjs/common';
import { Panel, Prisma, RelayType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PanelWithRelays } from './dto/panel.types';
import { encrypt, decrypt } from '../common/utils/crypto';

@Injectable()
export class PanelsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    ipAddress: string;
    port: number;
    login: string;
    password: string;
  }): Promise<Panel> {
    if (!data.login || !data.password) {
      throw new Error('Логин и пароль обязательны');
    }

    if (!data.ipAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      throw new Error('Неверный формат IP адреса');
    }

    if (data.port < 1 || data.port > 65535) {
      throw new Error('Порт должен быть от 1 до 65535');
    }

    const encryptedPanel = {
      ...data,
      login: encrypt(data.login),
      password: encrypt(data.password),
    };

    // Создаем панель
    const panel = await this.prisma.panel.create({ 
      data: encryptedPanel 
    });

    // Создаем 16 реле для новой панели
    const relayTypes: RelayType[] = ['LIGHT', 'SECURITY', 'GATE'];
    
    for (let i = 1; i <= 16; i++) {
      // Распределяем типы реле: 15 - свет, 16 - ворота, остальные - GATE
      let type: RelayType;
      if (i === 15) {
        type = 'LIGHT';
      } else if (i === 16) {
        type = 'SECURITY';
      } else {
        type = 'GATE';
      }
      
      await this.prisma.relay.create({
        data: {
          name: `Реле ${i}`,
          relayNumber: i,
          type,
          panel: {
            connect: {
              id: panel.id
            }
          }
        }
      });
    }

    return panel;
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      ipAddress: string;
      port: number;
      login: string;
      password: string;
    }>,
  ): Promise<Panel> {
    const panel = await this.prisma.panel.findUnique({
      where: { id },
    });

    if (!panel) {
      throw new NotFoundException(`Panel with ID ${id} not found`);
    }

    const updateData: any = { ...data };

    if (data.login) {
      updateData.login = encrypt(data.login);
    }

    if (data.password) {
      updateData.password = encrypt(data.password);
    }

    return this.prisma.panel.update({
      where: { id },
      data: updateData,
    });
  }

  async findAll(): Promise<PanelWithRelays[]> {
    const panels = await this.prisma.panel.findMany({
      include: {
        relays: {
          select: {
            id: true,
            name: true,
            relayNumber: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return panels.map((panel) => ({
      ...panel,
      login: decrypt(panel.login),
      password: decrypt(panel.password),
    }));
  }

  async findOne(id: string): Promise<PanelWithRelays> {
    const panel = await this.prisma.panel.findUnique({
      where: { id },
      include: {
        relays: {
          select: {
            id: true,
            name: true,
            relayNumber: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            relayNumber: 'asc',
          },
        },
      },
    });

    if (!panel) {
      throw new NotFoundException(`Panel with ID ${id} not found`);
    }

    return {
      ...panel,
      login: decrypt(panel.login),
      password: decrypt(panel.password),
    };
  }

  async remove(id: string): Promise<void> {
    await this.prisma.panel.delete({ where: { id } });
  }

  async checkConnection(id: string): Promise<boolean> {
    const panel = await this.findOne(id);

    try {
      const response = await fetch(`http://${panel.ipAddress}:${panel.port}/pstat.xml`);
      return response.status === 200;
    } catch {
      return false;
    }
  }
} 