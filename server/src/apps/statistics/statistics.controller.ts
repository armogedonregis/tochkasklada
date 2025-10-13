import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/apps/auth/guards/roles.guard';
import { Roles } from '@/apps/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) { }

  /**
   * Получение статистики по локациям
   */
  @Get('/locations')
  getLocationStatistics(
    @Query('locationId') locationId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.statisticsService.getLocationStatistics({
      locationId,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sortBy,
      sortDirection,
      startDate,
      endDate,
    });
  }

  /**
   * Получение детальных платежей по локации
   */
  @Get('/locations/:locationId/payments')
  getLocationPayments(
    @Param('locationId') locationId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
  ) {
    return this.statisticsService.getLocationPayments(locationId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      startDate,
      endDate,
      sortBy,
      sortDirection,
    });
  }


  /**
  * Получение всех платежей по локациям
  */
  @Get('/statistics')
  @UseGuards(JwtAuthGuard)
  getAllPaymentsByLocation() {
    return this.statisticsService.getPaymentsByLocations();
  }
}