import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }

  /**
   * Создание нового платежа (требуется аутентификация)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    this.logger.log(`=== Creating payment via API ===`);
    this.logger.log(`User: ${req.user.email} (${req.user.id})`);
    this.logger.log(`Amount: ${createPaymentDto.amount}, Description: ${createPaymentDto.description}`);
    
    const result = this.paymentsService.createPayment({
      ...createPaymentDto,
      userId: req.user.id,
    });
    
    this.logger.log('=== Payment creation API call completed ===');
    return result;
  }

  @Post('tilda')
  @HttpCode(HttpStatus.OK) // Tilda ожидает 200 OK в ответ
  handleTildaWebhook(@Body() payload: any, @Req() req: any) {
    this.logger.log('=== Tilda Payment Webhook ===');
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    // Проверка секретного ключа из заголовков
    const secretKey = req.headers['x-tilda-webhook-secret'];
    if (!secretKey || secretKey !== process.env.TILDA_WEBHOOK_SECRET) {
      this.logger.error('Invalid or missing webhook secret');
      throw new UnauthorizedException('Invalid or missing webhook secret');
    }
    this.logger.log('Webhook secret validated successfully');

    this.logger.debug(`Body: ${JSON.stringify(payload)}`);
    
    // Передаем данные в сервис для обработки
    const result = this.paymentsService.createTildaPayment(payload);
    this.logger.log('=== Tilda webhook processing completed ===');
    return result;
  }

  /**
   * Создание платежа администратором
   * 
   * Для создания платежа за аренду ячейки, добавьте параметры:
   * - cellId: ID ячейки
   * - rentalMonths: количество месяцев аренды (по умолчанию 1)
   * - statusId: ID статуса ячейки (опционально)
   */
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  createPaymentByAdmin(@Body() createPaymentDto: CreateAdminPaymentDto) {
    return this.paymentsService.createPaymentByAdmin(createPaymentDto);
  }

  /**
   * Обновление платежа администратором
   * 
   * Для работы с арендой ячейки доступны следующие параметры:
   * - cellRentalId: привязать платеж к существующей аренде
   * - cellId: создать новую аренду для указанной ячейки
   * - rentalMonths: количество месяцев аренды/продления
   * - extendRental: продлить существующую аренду
   * - detachRental: отвязать платеж от аренды
   * - rentalStartDate: новая дата начала аренды (формат: "YYYY-MM-DD")
   * - rentalEndDate: новая дата окончания аренды (формат: "YYYY-MM-DD")
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  /**
   * Установка статуса платежа вручную (только для админа)
   */
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  setPaymentStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: { status: boolean }
  ) {
    return this.paymentsService.setPaymentStatus(id, data.status);
  }

  /**
   * Получение ссылки на оплату для существующего платежа
   */
  @Get('payment-link/:orderId')
  async getPaymentLink(@Param('orderId') orderId: string) {
    return await this.paymentsService.createTinkoffPayment(orderId);
  }

  /**
   * Получение платежей текущего пользователя
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  getUserPayments(@Req() req: any) {
    return this.paymentsService.getUserPayments(req.user.id);
  }

  /**
   * Получение всех платежей с пагинацией и фильтрацией (только для админа)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getAllPayments(@Query() query: FindPaymentsDto) {
    return this.paymentsService.getAllPayments(query);
  }

  /**
 * Получение всех платежей по локациям
 */
  @Get('/statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getAllPaymentsByLocation() {
    return this.paymentsService.getPaymentsByLocations();
  }

  /**
   * Удаление платежа (только для админа)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.deletePayment(id);
  }

  /**
   * Получение информации о платеже по orderId
   */
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getPaymentByOrderId(@Param('orderId') orderId: string, @Req() req: any) {
    return this.paymentsService.getPaymentByOrderId(orderId, req.user);
  }

  /**
   * Обработка уведомлений от платежной системы
   */
  @Post('notification')
  @HttpCode(HttpStatus.OK)
  handleTinkoffNotification(@Body() notificationData: any) {
    return this.paymentsService.handleTinkoffNotification(notificationData);
  }
} 