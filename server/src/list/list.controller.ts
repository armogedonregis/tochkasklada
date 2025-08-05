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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('list')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  // Создание заявки (доступно всем аутентифицированным пользователям)
  @Post()
  async createList(@Body() createListDto: CreateListDto) {
    return this.listService.createList(createListDto);
  }

  // Получение всех заявок с фильтрацией и пагинацией
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getAllLists(@Query() queryParams: FindListsDto) {
    return this.listService.getAllLists(queryParams);
  }

  // Получение заявки по ID
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getListById(@Param('id') id: string) {
    return this.listService.getListById(id);
  }

  // Закрытие заявки
  @Patch(':id/close')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async closeList(
    @Param('id') id: string,
    @Body() closeListDto: CloseListDto,
    @Request() req: any
  ) {
    return this.listService.closeList(id, req.user.id, closeListDto);
  }

  // Получение статистики по заявкам
  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async getListStats() {
    return this.listService.getListStats();
  }

  // Удаление заявки
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  async deleteList(@Param('id') id: string) {
    return this.listService.deleteList(id);
  }
} 