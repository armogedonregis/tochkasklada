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
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { CellsService } from './cells.service';
import { CreateCellDto, UpdateCellDto, FindCellsDto } from './dto';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/apps/auth/guards/permissions.guard';
import { RequirePermissions } from '@/apps/auth/decorators/permissions.decorator';

// Контроллер для методов, доступных всем авторизованным пользователям
@Controller('cells')
@UseGuards(JwtAuthGuard)
export class CellsController {
  constructor(private readonly cellsService: CellsService) {}

  /**
   * Поиск ячеек с пагинацией, сортировкой и фильтрацией
   * Поддерживает фильтрацию по доступности (available), локации, размеру и поиск по строке
   * Для пользователей всегда возвращаются только доступные ячейки (available=true)
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('cells:read')
  findCells(@Query() query: FindCellsDto) {
    // Принудительно устанавливаем фильтрацию только по доступным ячейкам
    return this.cellsService.findCells({
      ...query,
      available: true
    });
  }
}

// Контроллер для методов, доступных только администраторам
@Controller('admin/cells')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CellsAdminController {
  constructor(private readonly cellsService: CellsService) {}

  /**
   * Расширенный поиск ячеек с пагинацией, сортировкой и фильтрацией
   * Для администраторов доступны все ячейки (и занятые, и свободные)
   */
  @Get()
  @RequirePermissions('cells:read')
  findCells(@Query() query: FindCellsDto) {
    return this.cellsService.findCells(query);
  }

  /**
   * Получение ячейки по ID
   */
  @Get(':id')
  @RequirePermissions('cells:read', 'Cell', 'id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellsService.findOne(id);
  }

  /**
   * Создание новой ячейки
   */
  @Post()
  @RequirePermissions('cells:create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCellDto: CreateCellDto) {
    return this.cellsService.create(createCellDto);
  }

  /**
   * Обновление ячейки
   */
  @Patch(':id')
  @RequirePermissions('cells:update', 'Cell', 'id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCellDto: UpdateCellDto) {
    return this.cellsService.update(id, updateCellDto);
  }

  /**
   * Удаление ячейки
   */
  @Delete(':id')
  @RequirePermissions('cells:delete', 'Cell', 'id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cellsService.remove(id);
  }
} 