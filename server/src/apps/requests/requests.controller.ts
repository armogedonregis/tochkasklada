import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  Patch, 
  Delete, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Logger
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto, FindRequestsDto, CloseRequestDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { UserRole } from '@prisma/client';

@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private readonly requestsService: RequestsService) {}

  /**
   * Создание новой заявки (публичный эндпоинт)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRequest(@Body() createRequestDto: CreateRequestDto) {
    this.logger.log(`Creating new request for ${createRequestDto.email}`);
    return this.requestsService.createRequest(createRequestDto);
  }

  /**
   * Получение всех заявок с фильтрацией и пагинацией (только для админов)
   */
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('requests:read')
  async getAllRequests(@Query() queryParams: FindRequestsDto) {
    this.logger.log('Getting all requests with filters');
    return this.requestsService.getAllRequests(queryParams);
  }

  /**
   * Получение заявки по ID (только для админов)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('requests:read')
  async getRequestById(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Getting request by ID: ${id}`);
    return this.requestsService.getRequestById(id);
  }

  /**
   * Закрытие заявки (только для админов)
   */
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('requests:close')
  @HttpCode(HttpStatus.OK)
  async closeRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() closeRequestDto: CloseRequestDto,
    @Request() req: any
  ) {
    this.logger.log(`Closing request ${id} by admin ${req.user.id}`);
    return this.requestsService.closeRequest(id, req.user.id, closeRequestDto);
  }

  /**
   * Перенос заявки в лист ожидания (только для админов)
   */
  @Patch(':id/move-to-list')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('requests:update')
  @HttpCode(HttpStatus.OK)
  async moveToList(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() closeRequestDto: CloseRequestDto,
    @Request() req: any
  ) {
    this.logger.log(`Moving request ${id} to list by admin ${req.user.id}`);
    return this.requestsService.moveRequestToList(id, req.user.id, closeRequestDto);
  }

  /**
   * Получение статистики по заявкам (только для админов)
   */
  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('requests:read')
  async getRequestsStats() {
    this.logger.log('Getting requests statistics');
    return this.requestsService.getRequestsStats();
  }

  /**
   * Удаление заявки (только для суперадминов)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('system:admin')
  @HttpCode(HttpStatus.OK)
  async deleteRequest(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Deleting request ${id}`);
    return this.requestsService.deleteRequest(id);
  }
} 