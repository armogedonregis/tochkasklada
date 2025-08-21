import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe,
  Logger
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { 
  AddPhoneDto, 
  CreateClientDto, 
  FindClientsDto,
  LandingFormDto, 
  UpdateClientDto 
} from './dto';

@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger('ClientsController');
  
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Публичный эндпоинт для формы с лендинга
   */
  @Post('landing')
  async createFromLanding(@Body() formData: LandingFormDto) {
    return this.clientsService.createFromLanding(formData);
  }

  /**
   * Добавление телефона клиенту
   * @returns Созданная запись телефона для RTK Query
   */
  @Post(':id/phones')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:update')
  @HttpCode(HttpStatus.CREATED)
  async addPhone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addPhoneDto: AddPhoneDto
  ) {
    return await this.clientsService.addPhone(
      id, 
      addPhoneDto.phone,
      addPhoneDto.comment
    );
  }

  /**
   * Удаление телефона клиента
   * @returns ID удаленного телефона для RTK Query
   */
  @Delete('phones/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:update')
  @HttpCode(HttpStatus.OK)
  async removePhone(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientsService.removePhone(id);
  }

  /**
   * Получение всех клиентов с пагинацией и сортировкой (только для админа)
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:read')
  @Get()
  async findAll(
    @Query() dto: FindClientsDto,
    @Query('isActive') rawIsActive?: string
  ) {
    this.logger.log(`Raw isActive query param: ${rawIsActive}, type: ${typeof rawIsActive}`);

    // Если isActive передан в запросе, переопределяем его значение в DTO
    if (rawIsActive !== undefined) {
      dto.isActive = rawIsActive.toLowerCase() === 'true';
      this.logger.log(`Overriding isActive in DTO to: ${dto.isActive}`);
    }
    
    return this.clientsService.findAll(dto);
  }

  /**
   * Получение клиента по ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientsService.findOne(id);
  }
  
  /**
   * Создание нового клиента (только для админа)
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createByAdmin(createClientDto);
  }
  
  /**
   * Обновление клиента (только для админа)
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:update')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.update(id, updateClientDto);
  }
  
  /**
   * Удаление клиента (только для админа)
   */
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clients:delete')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientsService.remove(id);
  }
} 