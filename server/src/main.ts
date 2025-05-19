import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    logger: true,
    bodyLimit: 10 * 1024 * 1024
  });

  // Добавляем хук для обработки пустого тела в DELETE запросах
  fastifyAdapter.getInstance().addHook('preHandler', (request, reply, done) => {
    if (request.method === 'DELETE' && !request.body) {
      request.body = {};
    }
    done();
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );
  
  // Глобальные настройки
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization'
  });
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Настройка Swagger
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
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT' 
      },
      'JWT'
    )
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger документация доступна по адресу: ${await app.getUrl()}/api/docs`);
}
bootstrap();
