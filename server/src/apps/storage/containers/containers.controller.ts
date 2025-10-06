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
  ParseUUIDPipe,
  Request
} from '@nestjs/common';
import { ContainersService } from './containers.service';
import { CreateContainerDto, FindContainersDto, UpdateContainerDto } from './dto';
import { JwtAuthGuard } from '@/apps/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/apps/auth/guards/permissions.guard';
import { RequirePermissions } from '@/apps/auth/decorators/permissions.decorator';

/**
 * Контроллер только для администраторов
 * Управление контейнерами доступно только через административный интерфейс
 */
@Controller('admin/containers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  /**
   * Получение контейнеров с пагинацией, сортировкой и фильтрацией
   * Поддерживает фильтрацию по locationId
   */
  @Get()
  @RequirePermissions('containers:read')
  async findAll(@Query() query: FindContainersDto, @Request() req) {
    return await this.containersService.findContainers(query, req.user);
  }

  /**
   * Получение контейнера по ID
   */
  @Get(':id')
  @RequirePermissions('containers:read', 'Container', 'id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.containersService.findOne(id);
  }

  /**
   * Создание нового контейнера
   * @returns Созданный контейнер для RTK Query
   */
  @Post()
  @RequirePermissions('containers:create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContainerDto: CreateContainerDto) {
    return await this.containersService.create(createContainerDto);
  }

  /**
   * Обновление контейнера
   * @returns Обновленный контейнер для RTK Query
   */
  @Patch(':id')
  @RequirePermissions('containers:update', 'Container', 'id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContainerDto: UpdateContainerDto
  ) {
    return await this.containersService.update(id, updateContainerDto);
  }

  /**
   * Удаление контейнера
   * @returns ID удаленного контейнера для RTK Query
   */
  @Delete(':id')
  @RequirePermissions('containers:delete', 'Container', 'id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.containersService.remove(id);
  }
} 