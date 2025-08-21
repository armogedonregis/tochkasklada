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
import { ContainersService } from './containers.service';
import { CreateContainerDto, FindContainersDto, UpdateContainerDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireResourcePermission } from '../auth/decorators/resource-permission.decorator';

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
  async findAll(@Query() query: FindContainersDto) {
    return await this.containersService.findContainers(query);
  }

  /**
   * Получение контейнера по ID
   */
  @Get(':id')
  @RequireResourcePermission('containers:read', 'Container', 'id')
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
  @RequireResourcePermission('containers:update', 'Container', 'id')
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
  @RequireResourcePermission('containers:delete', 'Container', 'id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.containersService.remove(id);
  }
} 