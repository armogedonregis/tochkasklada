import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Panel, Prisma, RelayType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePanelDto, UpdatePanelDto, FindPanelsDto, PanelSortField, SortDirection, PanelWithRelays } from './dto';
import { encrypt, decrypt } from '../common/utils/crypto';

@Injectable()
export class PanelsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Поиск панелей с пагинацией, сортировкой и фильтрацией
   */
  async findPanels(queryParams: FindPanelsDto) {
    const {
      search,
      page = 1,
      limit = 10,
      sortBy = PanelSortField.NAME,
      sortDirection = SortDirection.ASC
    } = queryParams;

    // Базовые условия фильтрации
    let where: Prisma.PanelWhereInput = {};

    // Если указана поисковая строка, строим сложное условие для поиска
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { ipAddress: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Вычисляем параметры пагинации
    const skip = (page - 1) * limit;

    // Настройка сортировки
    let orderBy: Prisma.PanelOrderByWithRelationInput = {};
    
    // В зависимости от выбранного поля сортировки
    switch (sortBy) {
      case PanelSortField.NAME:
        orderBy.name = sortDirection;
        break;
      case PanelSortField.IP_ADDRESS:
        orderBy.ipAddress = sortDirection;
        break;
      case PanelSortField.CREATED_AT:
      default:
        orderBy.createdAt = sortDirection;
        break;
    }

    // Запрос на получение общего количества
    const totalCount = await this.prisma.panel.count({ where });

    // Запрос на получение данных с пагинацией (без реле)
    const panels = await this.prisma.panel.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    // Дешифруем логин и пароль
    const decryptedPanels = panels.map((panel) => ({
      ...panel,
      login: decrypt(panel.login),
      password: decrypt(panel.password),
    }));

    // Рассчитываем количество страниц
    const totalPages = Math.ceil(totalCount / limit);

    // Возвращаем результат с мета-информацией
    return {
      data: decryptedPanels,
      meta: {
        totalCount,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Создание новой панели с реле
   */
  async create(createPanelDto: CreatePanelDto): Promise<Panel> {
    try {
      // Проверяем валидность ввода
      if (!createPanelDto.login || !createPanelDto.password) {
        throw new BadRequestException('Логин и пароль обязательны');
      }

      if (!createPanelDto.ipAddress.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        throw new BadRequestException('Неверный формат IP адреса');
      }

      if (createPanelDto.port < 1 || createPanelDto.port > 65535) {
        throw new BadRequestException('Порт должен быть от 1 до 65535');
      }

      const encryptedPanel = {
        ...createPanelDto,
        login: encrypt(createPanelDto.login),
        password: encrypt(createPanelDto.password),
      };

      // Создаем панель и реле в одной транзакции
      return await this.prisma.$transaction(async (tx) => {
        // Создаем панель
        const panel = await tx.panel.create({ 
          data: encryptedPanel 
        });

        // Создаем 16 реле для новой панели
        for (let i = 1; i <= 16; i++) {
          // Распределяем типы реле: 15 - свет, 16 - ворота, остальные - SECURITY (двери)
          let type: RelayType;
          if (i === 15) {
            type = 'LIGHT';
          } else if (i === 16) {
            type = 'GATE';
          } else {
            type = 'SECURITY';
          }
          
          await tx.relay.create({
            data: {
              name: `Реле ${i}`,
              relayNumber: i,
              type,
              panel: {
                connect: {
                  id: panel.id
                }
              }
            }
          });
        }

        // Возвращаем созданную панель с дешифрованными полями
        return {
          ...panel,
          login: decrypt(panel.login),
          password: decrypt(panel.password)
        };
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Панель с IP-адресом ${createPanelDto.ipAddress} уже существует`);
        }
      }
      throw new InternalServerErrorException(`Ошибка при создании панели: ${error.message}`);
    }
  }

  /**
   * Получение панели по ID с ее реле
   */
  async findOne(id: string): Promise<PanelWithRelays> {
    try {
      const panel = await this.prisma.panel.findUnique({
        where: { id },
        include: {
          relays: {
            orderBy: {
              relayNumber: 'asc',
            },
          },
        },
      });

      if (!panel) {
        throw new NotFoundException(`Панель с ID ${id} не найдена`);
      }

      return {
        ...panel,
        login: decrypt(panel.login),
        password: decrypt(panel.password),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при получении панели: ${error.message}`);
    }
  }

  /**
   * Обновление панели
   */
  async update(id: string, updatePanelDto: UpdatePanelDto): Promise<Panel> {
    try {
      // Проверяем существование панели
      await this.findOne(id);

      // Подготавливаем данные для обновления
      const updateData: any = { ...updatePanelDto };
      
      // Шифруем логин и пароль, если они предоставлены
      if (updateData.login) {
        updateData.login = encrypt(updateData.login);
      }
      
      if (updateData.password) {
        updateData.password = encrypt(updateData.password);
      }

      // Обновляем панель
      const updatedPanel = await this.prisma.panel.update({
        where: { id },
        data: updateData,
      });

      // Дешифруем данные для возврата
      return {
        ...updatedPanel,
        login: decrypt(updatedPanel.login),
        password: decrypt(updatedPanel.password),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Панель с таким IP-адресом уже существует`);
        }
      }
      throw new InternalServerErrorException(`Ошибка при обновлении панели: ${error.message}`);
    }
  }

  /**
   * Удаление панели
   */
  async remove(id: string): Promise<void> {
    try {
      // Проверяем существование панели
      await this.findOne(id);
      
      // Удаляем панель (каскадное удаление также удалит все связанные реле)
      await this.prisma.panel.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при удалении панели: ${error.message}`);
    }
  }

  /**
   * Проверка соединения с панелью
   */
  async checkConnection(id: string): Promise<boolean> {
    try {
      const panel = await this.findOne(id);
      
      // Здесь в будущем можно реализовать реальную проверку соединения с панелью
      // Например, через TCP/IP запрос к панели
      
      // Пока что просто возвращаем true, как будто соединение успешно
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return false;
    }
  }
} 