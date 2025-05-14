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
import { LocationsService } from './locations.service';
import { CreateLocationDto, FindLocationsDto, UpdateLocationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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
  async findAll(@Query() query: FindLocationsDto) {
    return await this.locationsService.findLocations(query);
  }

  /**
   * Получение локации по ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.locationsService.findOne(id);
  }
}

// Контроллер для методов, доступных только администраторам
@Controller('admin/locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class LocationsAdminController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Создание новой локации (только для админа)
   * @returns Созданная локация для RTK Query
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLocationDto: CreateLocationDto) {
    return await this.locationsService.create(createLocationDto);
  }

  /**
   * Обновление локации (только для админа)
   * @returns Обновленная локация для RTK Query
   */
  @Patch(':id')
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
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.locationsService.remove(id);
  }
} 