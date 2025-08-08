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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getAllRequests(@Query() queryParams: FindRequestsDto) {
    this.logger.log('Getting all requests with filters');
    return this.requestsService.getAllRequests(queryParams);
  }

  /**
   * Получение заявки по ID (только для админов)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getRequestById(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Getting request by ID: ${id}`);
    return this.requestsService.getRequestById(id);
  }

  /**
   * Закрытие заявки (только для админов)
   */
  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getRequestsStats() {
    this.logger.log('Getting requests statistics');
    return this.requestsService.getRequestsStats();
  }

  /**
   * Удаление заявки (только для суперадминов)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteRequest(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Deleting request ${id}`);
    return this.requestsService.deleteRequest(id);
  }
} 