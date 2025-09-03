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
import { LocationsService } from './locations.service';
import { CreateLocationDto, FindLocationsDto, UpdateLocationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { RequireResourcePermission } from '../auth/decorators/resource-permission.decorator';

// Контроллер для методов, доступных всем авторизованным пользователям
@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Получение всех локаций с пагинацией, сортировкой и поиском
   * Поиск работает по названию локации, адресу и названию города
   * Поддерживается сортировка по названию локации, короткому имени и городу
   */
  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('locations:read')
  async findAll(@Query() query: FindLocationsDto, @Request() req) {
    return await this.locationsService.findLocations(query, req.user);
  }

  /**
   * Получение локации по ID
   */
  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequireResourcePermission('locations:read', 'Location', 'id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.locationsService.findOne(id);
  }
}

// Контроллер для методов, доступных только администраторам
@Controller('admin/locations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LocationsAdminController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Создание новой локации (только для админа)
   * @returns Созданная локация для RTK Query
   */
  @Post()
  @RequirePermissions('locations:create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationsService.create(createLocationDto);
  }

  /**
   * Обновление локации (только для админа)
   * @returns Обновленная локация для RTK Query
   */
  @Patch(':id')
  @RequireResourcePermission('locations:update', 'Location', 'id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return await this.locationsService.update(id, updateLocationDto);
  }

  /**
   * Удаление локации (только для админа)
   * @returns ID удаленной локации для RTK Query
   */
  @Delete(':id')
  @RequireResourcePermission('locations:delete', 'Location', 'id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.locationsService.remove(id);
  }
} 