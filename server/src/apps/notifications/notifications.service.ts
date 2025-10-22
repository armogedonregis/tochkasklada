import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { FindEmailLogsDto } from './dto/find-email-logs.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findEmailLogs(query: FindEmailLogsDto) {
    const { page = 1, limit = 10, type, status, rentalId } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(type && { type }),
      ...(status && { status }),
      ...(rentalId && { rentalId }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.emailLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          rental: {
            include: {
              cell: true,
              client: true,
            }
          },
          client: true,
        },
        orderBy: { sentAt: 'desc' },
      }),
      this.prisma.emailLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEmailStats() {
    const stats = await this.prisma.emailLog.groupBy({
      by: ['type', 'status'],
      _count: { id: true },
    });

    const total = await this.prisma.emailLog.count();

    return {
      total,
      byType: stats.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + item._count.id;
        return acc;
      }, {}),
      byStatus: stats.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + item._count.id;
        return acc;
      }, {}),
    };
  }
}