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
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { PanelsService } from './panels.service';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/apps/auth/guards/roles.guard';
import { Roles } from '@/apps/auth/decorators/roles.decorator';
import { CreatePanelDto, UpdatePanelDto, FindPanelsDto } from './dto';
import { UserRole } from '@prisma/client';

@Controller('admin/panels')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class PanelsController {
  constructor(private readonly panelsService: PanelsService) {}

  /**
   * Поиск панелей с пагинацией и фильтрацией
   */
  @Get()
  findPanels(@Query() query: FindPanelsDto) {
    return this.panelsService.findPanels(query);
  }

  /**
   * Получение панели по ID с ее реле
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.panelsService.findOne(id);
  }

  /**
   * Создание новой панели с реле
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPanelDto: CreatePanelDto) {
    return this.panelsService.create(createPanelDto);
  }

  /**
   * Обновление панели
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePanelDto: UpdatePanelDto
  ) {
    return this.panelsService.update(id, updatePanelDto);
  }

  /**
   * Удаление панели
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.panelsService.remove(id);
  }

  /**
   * Проверка соединения с панелью
   */
  @Post(':id/check-connection')
  checkConnection(@Param('id', ParseUUIDPipe) id: string) {
    return this.panelsService.checkConnection(id);
  }
} 