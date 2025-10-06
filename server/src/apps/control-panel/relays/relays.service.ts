import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Relay, Prisma } from '@prisma/client';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { CreateRelayDto, UpdateRelayDto } from './dto';
import { decrypt } from '@/common/utils/crypto';

@Injectable()
export class RelaysService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание нового реле
   */
  async create(createRelayDto: CreateRelayDto): Promise<Relay> {
    try {
      // Проверяем, существует ли панель
      const panel = await this.prisma.panel.findUnique({
        where: { id: createRelayDto.panelId },
      });

      if (!panel) {
        throw new NotFoundException(`Панель с ID ${createRelayDto.panelId} не найдена`);
      }

      // Проверяем, что номер реле уникален для данной панели
      const existingRelay = await this.prisma.relay.findFirst({
        where: {
          panelId: createRelayDto.panelId,
          relayNumber: createRelayDto.relayNumber,
        },
      });

      if (existingRelay) {
        throw new ConflictException(`Реле с номером ${createRelayDto.relayNumber} уже существует на данной панели`);
      }

      // Создаем реле
      return await this.prisma.relay.create({
        data: {
          name: createRelayDto.name,
          relayNumber: createRelayDto.relayNumber,
          type: createRelayDto.type,
          panel: {
            connect: {
              id: createRelayDto.panelId
            }
          },
          ...(createRelayDto.cellId && {
            cell: {
              connect: {
                id: createRelayDto.cellId
              }
            }
          })
        },
        include: {
          panel: true,
          cell: true
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при создании реле: ${error.message}`);
    }
  }

  /**
   * Получение реле по ID
   */
  async findOne(id: string): Promise<Relay> {
    try {
      const relay = await this.prisma.relay.findUnique({ 
        where: { id },
        include: {
          panel: true,
          cell: true
        }
      });
      
      if (!relay) {
        throw new NotFoundException(`Реле с ID ${id} не найдено`);
      }
      
      return relay;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при получении реле: ${error.message}`);
    }
  }

  /**
   * Обновление реле
   */
  async update(id: string, updateRelayDto: UpdateRelayDto): Promise<Relay> {
    try {
      // Проверяем существование реле
      await this.findOne(id);

      // Если меняется номер реле или панель, проверяем уникальность
      if ((updateRelayDto.relayNumber || updateRelayDto.panelId) && !(updateRelayDto.relayNumber && updateRelayDto.panelId)) {
        // Получаем текущие данные реле
        const currentRelayInfo = await this.prisma.relay.findUnique({
          where: { id },
          select: { panelId: true, relayNumber: true }
        });

        // Проверяем, получили ли мы данные о текущем реле
        if (!currentRelayInfo) {
          throw new NotFoundException(`Реле с ID ${id} не найдено`);
        }

        // Проверяем, что номер реле уникален для данной панели
        const existingRelay = await this.prisma.relay.findFirst({
          where: {
            id: { not: id }, // Исключаем текущее реле
            panelId: updateRelayDto.panelId || currentRelayInfo.panelId,
            relayNumber: updateRelayDto.relayNumber || currentRelayInfo.relayNumber,
          },
        });

        if (existingRelay) {
          throw new ConflictException(
            `Реле с номером ${updateRelayDto.relayNumber || currentRelayInfo.relayNumber} уже существует на выбранной панели`
          );
        }
      }

      // Подготавливаем данные для обновления
      const updateData: Prisma.RelayUpdateInput = {
        name: updateRelayDto.name,
        relayNumber: updateRelayDto.relayNumber,
        type: updateRelayDto.type,
      };

      // Если указан ID панели
      if (updateRelayDto.panelId) {
        updateData.panel = {
          connect: { id: updateRelayDto.panelId }
        };
      }

      // Если указан ID ячейки
      if (updateRelayDto.cellId !== undefined) {
        if (updateRelayDto.cellId) {
          updateData.cell = {
            connect: { id: updateRelayDto.cellId }
          };
        } else {
          updateData.cell = {
            disconnect: true
          };
        }
      }

      // Обновляем реле
      return await this.prisma.relay.update({
        where: { id },
        data: updateData,
        include: {
          panel: true,
          cell: true
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при обновлении реле: ${error.message}`);
    }
  }

  /**
   * Переключение состояния реле
   */
  async toggle(id: string, state: boolean): Promise<boolean> {
    try {
      // Проверяем существование реле
      const relay = await this.findOne(id);
      
      // Получаем полную информацию о панели включая логин и пароль
      const panel = await this.prisma.panel.findUnique({
        where: { id: relay.panelId }
      });
      
      if (!panel) {
        throw new NotFoundException(`Панель для реле ${id} не найдена`);
      }
      
      // Расшифровываем логин и пароль панели
      const decryptedLogin = decrypt(panel.login);
      const decryptedPassword = decrypt(panel.password);
      
      try {
        // Создаем заголовок авторизации
        const authHeader = 'Basic ' + Buffer.from(`${decryptedLogin}:${decryptedPassword}`).toString('base64');
        
        // Отправляем запрос на панель для переключения реле
        const response = await fetch(
          `http://${panel.ipAddress}:${panel.port}/relay/${relay.relayNumber}/state`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            },
            body: JSON.stringify({ state: state ? 1 : 0 })
          }
        );
        
        if (!response.ok) {
          throw new Error(`Ошибка при отправке команды: ${response.status} ${response.statusText}`);
        }
        
        return true;
      } catch (httpError) {
        throw new InternalServerErrorException(`Ошибка при отправке команды на панель: ${httpError.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при управлении реле: ${error.message}`);
    }
  }

  /**
   * Импульсное включение реле
   */
  async pulse(id: string): Promise<boolean> {
    try {
      // Проверяем существование реле
      const relay = await this.findOne(id);
      
      // Получаем полную информацию о панели включая логин и пароль
      const panel = await this.prisma.panel.findUnique({
        where: { id: relay.panelId }
      });
      
      if (!panel) {
        throw new NotFoundException(`Панель для реле ${id} не найдена`);
      }
      
      // Расшифровываем логин и пароль панели
      const decryptedLogin = decrypt(panel.login);
      const decryptedPassword = decrypt(panel.password);
      
      try {
        // Создаем заголовок авторизации
        const authHeader = 'Basic ' + Buffer.from(`${decryptedLogin}:${decryptedPassword}`).toString('base64');
        
        // Отправляем запрос на панель для импульсного включения реле
        const response = await fetch(
          `http://${panel.ipAddress}:${panel.port}/relay/${relay.relayNumber}/pulse`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Ошибка при отправке команды: ${response.status} ${response.statusText}`);
        }
        
        return true;
      } catch (httpError) {
        throw new InternalServerErrorException(`Ошибка при отправке команды на панель: ${httpError.message}`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при управлении реле: ${error.message}`);
    }
  }

  /**
   * Удаление реле
   */
  async remove(id: string): Promise<void> {
    try {
      // Проверяем существование реле
      await this.findOne(id);
      
      // Удаляем реле
      await this.prisma.relay.delete({ where: { id } });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Ошибка при удалении реле: ${error.message}`);
    }
  }
} 