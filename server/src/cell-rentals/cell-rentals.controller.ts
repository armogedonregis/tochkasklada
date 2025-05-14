import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { UpdateCellRentalDto, FindCellRentalsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Административный контроллер для управления арендами ячеек
 */
@Controller('admin/cell-rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CellRentalsAdminController {
  constructor(private readonly cellRentalsService: CellRentalsService) {}

  /**
   * Получение всех аренд с поиском, фильтрацией и пагинацией
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: FindCellRentalsDto) {
    return this.cellRentalsService.findCellRentals(query);
  }

  /**
   * Получение аренды по ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.findOne(id);
  }

  /**
   * Обновление данных аренды
   */
  @Patch(':id')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.remove(id);
  }

  /**
   * Закрытие аренды (прекращение аренды)
   */
  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  closeRental(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.closeRental(id);
  }

  /**
   * Привязка существующего платежа к аренде
   */
  @Post('attach-payment/:paymentId/to-rental/:rentalId')
  @HttpCode(HttpStatus.OK)
  attachPaymentToRental(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Param('rentalId', ParseUUIDPipe) rentalId: string,
  ) {
    return this.cellRentalsService.attachPaymentToRental(paymentId, rentalId);
  }

  /**
   * Обновление статуса аренды
   */
  @Post(':id/update-status')
  @HttpCode(HttpStatus.OK)
  updateRentalStatus(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellRentalsService.updateRentalStatus(id);
  }

  /**
   * Обновление статусов всех активных аренд
   */
  @Post('update-all-statuses')
  @HttpCode(HttpStatus.OK)
  updateAllRentalStatuses() {
    return this.cellRentalsService.updateAllRentalStatuses();
  }

  /**
   * Получение всех активных аренд для конкретного клиента
   */
  @Get('client/:clientId/active')
  @HttpCode(HttpStatus.OK)
  findActiveRentalsByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.cellRentalsService.findActiveRentalsByClient(clientId);
  }

  /**
   * Получение всех аренд клиента (включая историю)
   */
  @Get('client/:clientId/all')
  @HttpCode(HttpStatus.OK)
  findAllRentalsByClient(@Param('clientId', ParseUUIDPipe) clientId: string) {
    return this.cellRentalsService.findAllRentalsByClient(clientId);
  }

  /**
   * Получение истории аренд для конкретной ячейки
   */
  @Get('cell/:cellId/history')
  @HttpCode(HttpStatus.OK)
  findRentalHistoryByCell(@Param('cellId', ParseUUIDPipe) cellId: string) {
    return this.cellRentalsService.findRentalHistoryByCell(cellId);
  }

  /**
   * Установка статуса для ячейки
   */
  @Put('cell/:cellId/set-status/:statusId')
  @HttpCode(HttpStatus.OK)
  setCellStatus(
    @Param('cellId', ParseUUIDPipe) cellId: string,
    @Param('statusId', ParseUUIDPipe) statusId: string,
  ) {
    return this.cellRentalsService.setCellStatus(cellId, statusId);
  }

  /**
   * Удаление статуса у ячейки
   */
  @Delete('cell/:cellId/remove-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCellStatus(@Param('cellId', ParseUUIDPipe) cellId: string) {
    return this.cellRentalsService.removeCellStatus(cellId);
  }
} 