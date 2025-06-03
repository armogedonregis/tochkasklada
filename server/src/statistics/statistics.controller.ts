import {
    Controller,
    Get,
    Query,
    Param,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '@prisma/client';
  import { StatisticsService } from './statistics.service';
  
  @Controller('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  export class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}
  
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
     * Детальная статистика по конкретной локации
     */
    @Get('/locations/:locationId')
    getLocationDetails(
      @Param('locationId') locationId: string,
      @Query('page') page?: number,
      @Query('limit') limit?: number,
      @Query('startDate') startDate?: Date,
      @Query('endDate') endDate?: Date,
    ) {
      return this.statisticsService.getLocationDetails(locationId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        startDate,
        endDate,
      });
    }
  }