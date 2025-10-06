import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  Query, 
  UseGuards,
  Request
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto, FindListsDto, CloseListDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@Controller('list')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  // Создание заявки (только для админов, т.к. записи создаются из requests)
  @Post()
  @RequirePermissions('lists:create')
  async createList(@Body() createListDto: CreateListDto) {
    return this.listService.createList(createListDto);
  }

  // Получение всех заявок с фильтрацией и пагинацией
  @Get()
  @RequirePermissions('lists:read')
  async getAllLists(@Query() queryParams: FindListsDto, @Request() req) {
    return this.listService.getAllLists(queryParams, req.user);
  }

  // Получение заявки по ID
  @Get(':id')
  @RequirePermissions('lists:read')
  async getListById(@Param('id') id: string) {
    return this.listService.getListById(id);
  }

  // Закрытие заявки
  @Patch(':id/close')
  @RequirePermissions('lists:close')
  async closeList(
    @Param('id') id: string,
    @Body() closeListDto: CloseListDto,
    @Request() req: any
  ) {
    return this.listService.closeList(id, req.user.id, closeListDto);
  }

  // Статистика по листу ожидания (упрощенная)
  @Get('stats/overview')
  @RequirePermissions('lists:read')
  async getListStats() {
    return this.listService.getListStats();
  }

  // Удаление заявки
  @Delete(':id')
  @RequirePermissions('system:admin')
  async deleteList(@Param('id') id: string) {
    return this.listService.deleteList(id);
  }
} 