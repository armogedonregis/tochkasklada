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
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/apps/auth/guards/permissions.guard';
import { RequirePermissions } from '@/apps/auth/decorators/permissions.decorator';
import { CreateAdminPaymentDto, UpdatePaymentDto, FindPaymentsDto, CreatePaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) { }

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
  @HttpCode(HttpStatus.OK)
  handleTildaWebhook(@Body() payload: any, @Req() req: any) {
    this.logger.log('=== Tilda Payment Webhook ===');
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    const secretKey = req.headers['x-tilda-webhook-secret'];
    if (!secretKey || secretKey !== process.env.TILDA_WEBHOOK_SECRET) {
      this.logger.error('Invalid or missing webhook secret');
      throw new UnauthorizedException('Invalid or missing webhook secret');
    }

    this.logger.debug(`Body: ${JSON.stringify(payload)}`);
    
    const result = this.paymentsService.createTildaPayment(payload);
    this.logger.log('=== Tilda webhook processing completed ===');
    return result;
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('payments:create')
  @HttpCode(HttpStatus.CREATED)
  createPaymentByAdmin(@Body() createPaymentDto: CreateAdminPaymentDto) {
    return this.paymentsService.createPaymentByAdmin(createPaymentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('payments:update', 'Payment', 'id')
  updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Get('payment-link/:orderId')
  async getPaymentLink(@Param('orderId') orderId: string) {
    return await this.paymentsService.createTinkoffPayment(orderId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getUserPayments(@Req() req: any) {
    return this.paymentsService.getUserPayments(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('payments:read')
  getAllPayments(@Query() query: FindPaymentsDto, @Req() req: any) {
    return this.paymentsService.getAllPayments(query, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('payments:delete', 'Payment', 'id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.deletePayment(id);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  getPaymentByOrderId(@Param('orderId') orderId: string, @Req() req: any) {
    return this.paymentsService.getPaymentByOrderId(orderId, req.user);
  }

  @Post('notification')
  @HttpCode(HttpStatus.OK)
  handleTinkoffNotification(@Body() notificationData: any) {
    return this.paymentsService.handleTinkoffNotification(notificationData);
  }
}