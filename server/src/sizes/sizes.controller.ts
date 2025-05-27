import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  ParseUUIDPipe,
  UseGuards
} from '@nestjs/common';
import { SizesService } from './sizes.service';
import { CreateSizeDto, UpdateSizeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('sizes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  /**
   * Получение всех размеров ячеек
   */
  @Get()
  findSizes() {
    return this.sizesService.findSizes();
  }

  /**
   * Получение размера ячейки по ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sizesService.findOne(id);
  }

  /**
   * Создание нового размера ячейки
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  /**
   * Обновление размера ячейки
   */
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(id, updateSizeDto);
  }

  /**
   * Удаление размера ячейки
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sizesService.remove(id);
  }
} 