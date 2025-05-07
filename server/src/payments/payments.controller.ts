import { Controller, Post, Body, Get, Param, UseGuards, Req, Put, Delete, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAdminPaymentDto, UpdatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Создание нового платежа (требуется аутентификация)
  @Post()
  @UseGuards(JwtAuthGuard)
  createPayment(@Body() createPaymentDto: any, @Req() req: any) {
    return this.paymentsService.createPayment({
      ...createPaymentDto,
      userId: req.user.id,
    });
  }

  // Создание платежа администратором
  // Для создания платежа за аренду ячейки, добавьте параметры:
  // - cellId: ID ячейки
  // - rentalMonths: количество месяцев аренды (по умолчанию 1)
  // - statusId: ID статуса ячейки (опционально)
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createPaymentByAdmin(@Body() createPaymentDto: CreateAdminPaymentDto) {
    return this.paymentsService.createPaymentByAdmin(createPaymentDto);
  }

  // Обновление платежа администратором
  // Для работы с арендой ячейки доступны следующие параметры:
  // - cellRentalId: привязать платеж к существующей аренде
  // - cellId: создать новую аренду для указанной ячейки
  // - rentalMonths: количество месяцев аренды/продления
  // - extendRental: продлить существующую аренду
  // - detachRental: отвязать платеж от аренды
  // - rentalStartDate: новая дата начала аренды (формат: "YYYY-MM-DD")
  // - rentalEndDate: новая дата окончания аренды (формат: "YYYY-MM-DD")
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  // Установка статуса платежа вручную (только для админа)
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  setPaymentStatus(@Param('id') id: string, @Body() data: { status: boolean }) {
    return this.paymentsService.setPaymentStatus(id, data.status);
  }

  // Получение ссылки на оплату для существующего платежа
  @Get('payment-link/:orderId')
  async getPaymentLink(@Param('orderId') orderId: string) {
    const result = await this.paymentsService.createTinkoffPayment(orderId);
    return result;
  }

  // Получение платежей текущего пользователя
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getUserPayments(@Req() req: any) {
    return this.paymentsService.getUserPayments(req.user.id);
  }

  // Получение всех платежей (только для админа)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  // Удаление платежа (только для админа)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }

  // Получение информации о платеже по orderId
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getPaymentByOrderId(@Param('orderId') orderId: string, @Req() req: any) {
    return this.paymentsService.getPaymentByOrderId(orderId, req.user);
  }

  // Обработка уведомлений от Tinkoff Bank
  @Post('notification')
  handleTinkoffNotification(@Body() notificationData: any) {
    return this.paymentsService.handleTinkoffNotification(notificationData);
  }
} 