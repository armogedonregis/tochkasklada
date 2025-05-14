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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Публичный контроллер для методов, доступных всем авторизованным пользователям
 */
@Controller('containers')
@UseGuards(JwtAuthGuard)
export class ContainersPublicController {
  constructor(private readonly containersService: ContainersService) {}

  /**
   * Получение всех контейнеров с фильтрацией (для клиента)
   */
  @Get()
  async findAll(@Query() query: FindContainersDto) {
    return await this.containersService.findContainers(query);
  }
}

/**
 * Контроллер только для администраторов
 * Управление контейнерами доступно только через административный интерфейс
 */
@Controller('admin/containers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  /**
   * Получение контейнеров с пагинацией, сортировкой и фильтрацией
   * Поддерживает фильтрацию по locationId
   */
  @Get()
  async findAll(@Query() query: FindContainersDto) {
    return await this.containersService.findContainers(query);
  }

  /**
   * Получение контейнера по ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.containersService.findOne(id);
  }

  /**
   * Создание нового контейнера
   * @returns Созданный контейнер для RTK Query
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContainerDto: CreateContainerDto) {
    return await this.containersService.create(createContainerDto);
  }

  /**
   * Обновление контейнера
   * @returns Обновленный контейнер для RTK Query
   */
  @Patch(':id')
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
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.containersService.remove(id);
  }
} 