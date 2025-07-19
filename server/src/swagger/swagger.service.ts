import { Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
  private document: OpenAPIObject | null = null;

  /**
   * Создает документ OpenAPI для API-документации
   */
  public generateDocument(): OpenAPIObject {
    if (!this.document) {
      throw new Error('Swagger not initialized');
    }

    return this.document;
  }

  /**
   * Инициализация сервиса с экземпляром приложения
   */
  public initWithApp(app: INestApplication): void {
    if (this.document) {
      return;
    }

    try {
      // Настраиваем документ Swagger
      const config = new DocumentBuilder()
        .setTitle('API системы управления точками самостоятельного хранения')
        .setDescription(`
        Полная документация API по следующим разделам:
        - Локации (склады в Санкт-Петербурге)
        - Контейнеры и ячейки
        - Пользователи и клиенты
        - Бронирования и аренда
        - Платежи и транзакции
      `)
        .setVersion('1.0.1')
        .build();

      this.document = SwaggerModule.createDocument(app, config);

    } catch (error) {
      console.error('Ошибка при инициализации Swagger сервиса:', error);
    }
  }
}