import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Поиск пользователя по ID
   */
  async findOne(id: string) {
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
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  /**
   * Поиск пользователя по email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Создание нового пользователя
   */
  async create(createUserDto: CreateUserDto) {
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

    return user;
  }
  
  /**
   * Создание клиента для пользователя
   */
  async createClient(userId: string, clientData: { name: string }) {
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    // Создаем клиента
    await this.prisma.client.create({ 
      data: {
        ...clientData,
        userId,
      },
    });

    // Возвращаем обновленные данные пользователя
    return this.findOne(userId);
  }

  /**
   * Обновление пользователя
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
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

    return user;
  }

  /**
   * Удаление пользователя
   */
  async remove(id: string) {
    // Проверяем существование пользователя
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
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

    return user;
  }

  /**
   * Получение всех пользователей
   */
  async findAll() {
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