import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { CellStatusesService } from './cell-statuses.service';
import { CreateCellStatusDto, UpdateCellStatusDto } from './dto';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/apps/auth/guards/roles.guard';
import { Roles } from '@/apps/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/cell-statuses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class CellStatusesController {
  constructor(private readonly cellStatusesService: CellStatusesService) {}

  /**
   * Создание нового статуса ячейки
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCellStatusDto: CreateCellStatusDto) {
    return this.cellStatusesService.create(createCellStatusDto);
  }

  /**
   * Получение всех статусов ячеек
   */
  @Get()
  findAll() {
    return this.cellStatusesService.findAll();
  }

  /**
   * Получение статуса ячейки по ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellStatusesService.findOne(id);
  }

  /**
   * Обновление статуса ячейки
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCellStatusDto: UpdateCellStatusDto,
  ) {
    return this.cellStatusesService.update(id, updateCellStatusDto);
  }

  /**
   * Удаление статуса ячейки
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellStatusesService.remove(id);
  }
} 