import { Injectable } from '@nestjs/common';
import { RelayAccess, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelayAccessService {
  constructor(private prisma: PrismaService) {}

  async grantAccess(data: Prisma.RelayAccessCreateInput): Promise<RelayAccess> {
    return this.prisma.relayAccess.create({ data });
  }

  async checkAccess(userId: string, relayId: string): Promise<boolean> {
    const access = await this.prisma.relayAccess.findFirst({
      where: {
        userId,
        relayId,
        isActive: true,
        validUntil: {
          gt: new Date(),
        },
      },
    });
    
    return !!access;
  }

  async findAll(): Promise<RelayAccess[]> {
    return this.prisma.relayAccess.findMany({
      include: {
        relay: true,
      },
    });
  }

  async findByUser(userId: string): Promise<RelayAccess[]> {
    return this.prisma.relayAccess.findMany({
      where: {
        userId,
        isActive: true,
        validUntil: {
          gt: new Date(),
        },
      },
      include: {
        relay: {
          include: {
            panel: true,
          },
        },
      },
    });
  }

  async revokeAccess(id: string): Promise<void> {
    await this.prisma.relayAccess.update({
      where: { id },
      data: { isActive: false },
    });
  }
} 