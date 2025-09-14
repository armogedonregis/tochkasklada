import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, ParseUUIDPipe, Post, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Получить список всех пользователей (только для суперадмина)
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: { user: { role: string } }) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Доступ только для суперадмина');
    }
    
    return this.usersService.findAll();
  }

  /**
   * Получить данные текущего пользователя
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.findOne(req.user.id);
  }

  /**
   * Получить пользователя по ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Создать нового пользователя (только для суперадмина)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @Request() req: { user: { role: string } }) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Доступ только для суперадмина');
    }
    return this.usersService.create(createUserDto);
  }

  /**
   * Обновить пользователя (только для суперадмина)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: { user: { role: string } }) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Доступ только для суперадмина');
    }
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Удалить пользователя (только для суперадмина)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: { user: { role: string } }) {
    if (req.user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Доступ только для суперадмина');
    }
    await this.usersService.remove(id);
  }
} 