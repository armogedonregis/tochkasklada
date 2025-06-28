import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UsersService instantiated', 'UsersService');
  }

  /**
   * Поиск пользователя по ID
   */
  async findOne(id: string) {
    this.logger.log(`Fetching user with id: ${id}`, 'UsersService');
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        client: true,
      },
    });

    if (!user) {
      this.logger.warn(`User with id: ${id} not found`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  /**
   * Поиск пользователя по email
   */
  async findByEmail(email: string) {
    this.logger.log(`Fetching user with email: ${email}`, 'UsersService');
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn(`User with email: ${email} not found`, 'UsersService');
      return null;
    }

    return user;
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating a new user with email: ${createUserDto.email}`, 'UsersService');
    const user = await this.prisma.user.create({ 
      data: createUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User created with id: ${user.id}`, 'UsersService');
    return user;
  }
  
  /**
   * Создание клиента для пользователя
   */
  async createClient(userId: string, clientData: { name: string }) {
    this.logger.log(`Creating client for user id: ${userId}`, 'UsersService');
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${userId} not found, cannot create client`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Создаем клиента
    await this.prisma.client.create({ 
      data: {
        ...clientData,
        userId,
      },
    });

    this.logger.log(`Client created for user id: ${userId}`, 'UsersService');
    // Возвращаем обновленные данные пользователя
    return this.findOne(userId);
  }

  /**
   * Обновление пользователя
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with id: ${id}`, 'UsersService');
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${id} not found, cannot update`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User with id: ${id} updated successfully`, 'UsersService');
    return user;
  }

  /**
   * Удаление пользователя
   */
  async remove(id: string) {
    this.logger.log(`Removing user with id: ${id}`, 'UsersService');
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      this.logger.warn(`User with id: ${id} not found, cannot remove`, 'UsersService');
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    const user = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User with id: ${id} removed successfully`, 'UsersService');
    return user;
  }

  /**
   * Получение всех пользователей
   */
  async findAll() {
    this.logger.log('Fetching all users', 'UsersService');
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        client: true,
      },
    });

    return users;
  }
} 