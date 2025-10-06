import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseUUIDPipe, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { UpdateCellRentalDto, FindCellRentalsDto, ExtendCellRentalDto, UpdateRentalStatusDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { CellRentalStatus, UserRole } from '@prisma/client';
import { FindFreeCellRentalsDto } from './dto/find-free-cells.dto';
import { FindGanttRentalsDto } from './dto/find-gantt-rentals.dto';

/**
 * Административный контроллер для управления арендами ячеек
 */
@Controller('admin/cell-rentals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CellRentalsAdminController {
  constructor(private readonly cellRentalsService: CellRentalsService) {}

  /**
   * Получение всех аренд с поиском, фильтрацией и пагинацией
   */
  @Get()
  @RequirePermissions('rentals:read')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: FindCellRentalsDto, @Req() req: any) {
    return this.cellRentalsService.findCellRentals(query, req.user);
  }

  /**
   * Получение аренды по ID
   */
  @Get(':id')
  @RequirePermissions('rentals:read', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.findOne(id);
  }

  /**
   * Обновление данных аренды
   */
  @Patch(':id')
  @RequirePermissions('rentals:update', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCellRentalDto: UpdateCellRentalDto
  ) {
    return this.cellRentalsService.update(id, updateCellRentalDto);
  }

  /**
   * Удаление аренды
   */
  @Delete(':id')
  @RequirePermissions('rentals:delete', 'CellRental', 'id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.remove(id);
  }

  /**
   * Закрытие аренды (прекращение аренды)
   */
  @Post(':id/close')
  @RequirePermissions('rentals:update', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  closeRental(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.closeRental(id);
  }

  /**
   * Обновление статуса аренды (новый упрощенный endpoint)
   */
  @Patch(':id/status')
  @RequirePermissions('rentals:update', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  updateRentalStatus(@Param('id', ParseUUIDPipe) id: string, @Body() updateRentalStatusDto: UpdateRentalStatusDto) {
    return this.cellRentalsService.updateRentalStatus(id, updateRentalStatusDto);
  }

  /**
   * Обновление статуса аренды (старый endpoint для обратной совместимости)
   */
  @Post(':id/update-status')
  @RequirePermissions('rentals:update', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  updateRentalStatusLegacy(@Param('id', ParseUUIDPipe) id: string, @Body() { rentalStatus }: { rentalStatus: CellRentalStatus }) {
    return this.cellRentalsService.forceRentalStatus(id, rentalStatus);
  }

  /**
   * Продление аренды (создает платеж и обновляет дату окончания)
   */
  @Post(':id/extend')
  @RequirePermissions('rentals:update', 'CellRental', 'id')
  @HttpCode(HttpStatus.OK)
  extendRental(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() extendDto: Omit<ExtendCellRentalDto, 'cellRentalId'>
  ) {
    const fullDto: ExtendCellRentalDto = {
      cellRentalId: id,
      ...extendDto
    };
    return this.cellRentalsService.extendRental(fullDto);
  }

  /**
   * Обновление статусов всех активных аренд
   */
  @Post('update-all-statuses')
  @RequirePermissions('rentals:update')
  @HttpCode(HttpStatus.OK)
  updateAllRentalStatuses() {
    return this.cellRentalsService.updateAllRentalStatuses();
  }

  /**
   * Получение всех активных аренд для конкретного клиента
   */
  @Get('client/:clientId/active')
  @RequirePermissions('rentals:read')
  @HttpCode(HttpStatus.OK)
  findActiveRentalsByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.cellRentalsService.findActiveRentalsByClient(clientId);
  }

  /**
   * Получение всех аренд клиента (включая историю)
   */
  @Get('client/:clientId/all')
  @RequirePermissions('rentals:read')
  @HttpCode(HttpStatus.OK)
  findAllRentalsByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.cellRentalsService.findAllRentalsByClient(clientId);
  }

  /**
   * Получение истории аренд для конкретной ячейки
   */
  @Get('cell/:cellId/history')
  @RequirePermissions('rentals:read', 'Cell', 'cellId')
  @HttpCode(HttpStatus.OK)
  findRentalHistoryByCell(@Param('cellId', ParseUUIDPipe) cellId: string) {
    return this.cellRentalsService.findRentalHistoryByCell(cellId);
  }

  /**
   * Получение свободных ячеек
   */
  @Get('free-cells')
  @RequirePermissions('rentals:read')
  @HttpCode(HttpStatus.OK)
  getFreeCells(@Query() query: FindFreeCellRentalsDto) {
    return this.cellRentalsService.getFreeCells(query);
  }

  /**
   * Получение данных для диаграммы Ганта
   */
  @Get('gantt')
  @RequirePermissions('rentals:read')
  @HttpCode(HttpStatus.OK)
  getGanttData(@Query() query: FindGanttRentalsDto) {
    return this.cellRentalsService.findGanttRentals(query);
  }

  /**
   * Синхронизация визуальных статусов всех аренд
   */
  @Post('sync-visual-statuses')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('system:admin')
  syncVisualStatuses() {
    return this.cellRentalsService.syncAllRentalVisualStatuses();
  }
} 