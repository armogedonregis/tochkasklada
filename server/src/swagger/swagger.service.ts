import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerService {
  private document: any;
  
  /**
   * Создает документ OpenAPI для API-документации
   */
  async generateDocument(): Promise<any> {
    if (this.document) {
      return this.document;
    }
    
    // Если документ еще не создан (initWithApp не был вызван), создаем базовый вариант
    this.document = {
      openapi: '3.0.0',
      info: {
        title: 'API системы управления точками самостоятельного хранения',
        description: 'Полная документация API системы',
        version: '1.0'
      },
    };
    
    return this.document;
  }
  
  /**
   * Инициализация сервиса с экземпляром приложения
   */
  public initWithApp(app: INestApplication): void {
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
        .setVersion('1.0')
        .build();
      
      this.document = SwaggerModule.createDocument(app, config);
      
    } catch (error) {
      console.error('Ошибка при инициализации Swagger сервиса:', error);
    }
  }
}