import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { RelaysService } from './relays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateRelayDto, UpdateRelayDto, ToggleRelayDto } from './dto';
import { UserRole } from '@prisma/client';

// Административная часть API для работы с реле
@Controller('admin/relays')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class RelaysController {
  constructor(private readonly relaysService: RelaysService) {}

  /**
   * Получение реле по ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.relaysService.findOne(id);
  }

  /**
   * Создание нового реле
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRelayDto: CreateRelayDto) {
    return this.relaysService.create(createRelayDto);
  }

  /**
   * Обновление реле
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRelayDto: UpdateRelayDto
  ) {
    return this.relaysService.update(id, updateRelayDto);
  }

  /**
   * Удаление реле
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.relaysService.remove(id);
  }

  /**
   * Переключение состояния реле (вкл/выкл)
   */
  @Post(':id/toggle')
  @HttpCode(HttpStatus.OK)
  toggle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() toggleDto: ToggleRelayDto
  ) {
    return this.relaysService.toggle(id, toggleDto.state);
  }

  /**
   * Импульсное включение реле
   */
  @Post(':id/pulse')
  @HttpCode(HttpStatus.OK)
  pulse(@Param('id', ParseUUIDPipe) id: string) {
    return this.relaysService.pulse(id);
  }
} 