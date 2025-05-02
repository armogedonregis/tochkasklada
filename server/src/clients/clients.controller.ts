import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards,
  Patch 
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// DTO для формы лендинга
class LandingFormDto {
  name: string;
  email: string;
  phone: string;
}

// DTO для добавления телефона
class AddPhoneDto {
  phone: string;
}

// DTO для создания клиента админом
class CreateClientDto {
  name: string;
  email: string;
  password?: string;
  phones?: string[];
}

// DTO для обновления клиента
class UpdateClientDto {
  name?: string;
  email?: string;
  phones?: string[];
}

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Публичный эндпоинт для формы с лендинга
  @Post('landing')
  async createFromLanding(@Body() formData: LandingFormDto) {
    return this.clientsService.createFromLanding(formData);
  }

  // Эндпоинт для поиска клиента по телефону
  @Get('phone/:phone')
  @UseGuards(JwtAuthGuard)
  async findByPhone(@Param('phone') phone: string) {
    return this.clientsService.findByPhone(phone);
  }

  // Эндпоинт для поиска клиента по email
  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  async findByEmail(@Param('email') email: string) {
    return this.clientsService.findByEmail(email);
  }

  // Добавление телефона клиенту
  @Post(':id/phones')
  @UseGuards(JwtAuthGuard)
  async addPhone(
    @Param('id') id: string,
    @Body() addPhoneDto: AddPhoneDto
  ) {
    return this.clientsService.addPhone(
      id, 
      addPhoneDto.phone
    );
  }

  // Удаление телефона
  @Delete('phones/:id')
  @UseGuards(JwtAuthGuard)
  async removePhone(@Param('id') id: string) {
    return this.clientsService.removePhone(id);
  }

  // Получение всех клиентов (для админа)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // Получение клиента по ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }
  
  // Создание нового клиента (для админа)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.createByAdmin(createClientDto);
  }
  
  // Обновление клиента (для админа)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientsService.update(id, updateClientDto);
  }
  
  // Удаление клиента (для админа)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
} 