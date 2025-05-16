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
  ParseUUIDPipe
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { 
  AddPhoneDto, 
  CreateClientDto, 
  FindClientsDto,
  LandingFormDto, 
  UpdateClientDto 
} from './dto';

@Controller('clients')
export class ClientsController {
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
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async addPhone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addPhoneDto: AddPhoneDto
  ) {
    return await this.clientsService.addPhone(
      id, 
      addPhoneDto.phone
    );
  }

  /**
   * Удаление телефона клиента
   * @returns ID удаленного телефона для RTK Query
   */
  @Delete('phones/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async removePhone(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientsService.removePhone(id);
  }

  /**
   * Получение всех клиентов с пагинацией и сортировкой (только для админа)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(@Query() query: FindClientsDto) {
    return this.clientsService.findAll(query);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createByAdmin(createClientDto);
  }
  
  /**
   * Обновление клиента (только для админа)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientsService.remove(id);
  }
} 