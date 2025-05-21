import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto, FindCitiesDto, UpdateCityDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Контроллер для методов, доступных всем авторизованным пользователям
@Controller('cities')
@UseGuards(JwtAuthGuard)
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * Получение всех городов с пагинацией, сортировкой и поиском
   * Поиск работает по названию города и короткому имени
   */
  @Get()
  async findAll(@Query() query: FindCitiesDto) {
    return await this.citiesService.findCities(query);
  }

  /**
   * Получение города по ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.citiesService.findOne(id);
  }
}

// Контроллер для методов, доступных только администраторам
@Controller('admin/cities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPERADMIN')
export class CitiesAdminController {
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * Создание нового города (только для админа)
   * @returns Созданный город для RTK Query
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCityDto: CreateCityDto) {
    return await this.citiesService.create(createCityDto);
  }

  /**
   * Обновление города (только для админа)
   * @returns Обновленный город для RTK Query
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return await this.citiesService.update(id, updateCityDto);
  }

  /**
   * Удаление города (только для админа)
   * @returns ID удаленного города для RTK Query
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.citiesService.remove(id);
  }
} 