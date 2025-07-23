import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerService } from './swagger/swagger.service';
import { LoggerService } from './logger/logger.service';

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
    fastifyAdapter,
    {
      bufferLogs: true,
    }
  );

  // Используем кастомный логгер
  const logger = app.get(LoggerService);
  app.useLogger(logger);

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

  // Инициализация Swagger с экземпляром приложения
  const swaggerService = app.get(SwaggerService);
  swaggerService.initWithApp(app);
  
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
