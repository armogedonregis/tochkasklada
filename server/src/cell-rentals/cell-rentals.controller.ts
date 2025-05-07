import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { CellRentalsService } from './cell-rentals.service';
import { CreateCellRentalDto, UpdateCellRentalDto, ExtendCellRentalDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('cell-rentals')
@UseGuards(JwtAuthGuard)
export class CellRentalsController {
  constructor(private readonly cellRentalsService: CellRentalsService) {}

  // Создание новой аренды (только админ)
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createCellRentalDto: CreateCellRentalDto) {
    return this.cellRentalsService.create(createCellRentalDto);
  }

  // Получение всех аренд (только админ)
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.cellRentalsService.findAll();
  }

  // Получение конкретной аренды
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cellRentalsService.findOne(id);
  }

  // Обновление аренды (только админ)
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateCellRentalDto: UpdateCellRentalDto) {
    return this.cellRentalsService.update(id, updateCellRentalDto);
  }

  // Удаление аренды (только админ)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.cellRentalsService.remove(id);
  }

  // Закрытие аренды (только админ)
  @Post(':id/close')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  closeRental(@Param('id') id: string) {
    return this.cellRentalsService.closeRental(id);
  }

  // Продление аренды (только админ)
  @Post('extend')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  extendRental(@Body() extendDto: ExtendCellRentalDto, @Req() req: any) {
    return this.cellRentalsService.extendRental(req.user.id, extendDto);
  }

  // Привязка платежа к аренде (только админ)
  @Post('attach-payment/:paymentId/to-rental/:rentalId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  attachPaymentToRental(
    @Param('paymentId') paymentId: string,
    @Param('rentalId') rentalId: string,
  ) {
    return this.cellRentalsService.attachPaymentToRental(paymentId, rentalId);
  }

  // Получение аренд по клиенту (активных)
  @Get('client/:clientId/active')
  findActiveRentalsByClient(@Param('clientId') clientId: string) {
    return this.cellRentalsService.findActiveRentalsByClient(clientId);
  }

  // Получение всех аренд по клиенту (включая историю)
  @Get('client/:clientId/all')
  findAllRentalsByClient(@Param('clientId') clientId: string) {
    return this.cellRentalsService.findAllRentalsByClient(clientId);
  }

  // Получение истории аренд для ячейки
  @Get('cell/:cellId/history')
  findRentalHistoryByCell(@Param('cellId') cellId: string) {
    return this.cellRentalsService.findRentalHistoryByCell(cellId);
  }

  // Обновление статуса аренды (только админ)
  @Post(':id/update-status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateRentalStatus(@Param('id') id: string) {
    return this.cellRentalsService.updateRentalStatus(id);
  }

  // Обновление статусов всех активных аренд (только админ)
  @Post('update-all-statuses')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  updateAllRentalStatuses() {
    return this.cellRentalsService.updateAllRentalStatuses();
  }

  // Управление статусами ячеек
  @Put('cell/:cellId/set-status/:statusId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  setCellStatus(
    @Param('cellId') cellId: string,
    @Param('statusId') statusId: string,
  ) {
    return this.cellRentalsService.setCellStatus(cellId, statusId);
  }

  @Delete('cell/:cellId/remove-status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  removeCellStatus(@Param('cellId') cellId: string) {
    return this.cellRentalsService.removeCellStatus(cellId);
  }
} 