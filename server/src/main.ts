import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerService } from './swagger/swagger.service';
import * as winston from 'winston';
import * as path from 'path';

async function bootstrap() {
  // Настройка Winston логгера
  const logDir = process.env.LOGS_DIR || path.join(process.cwd(), 'logs');
  
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'api' },
    transports: [
      // Ротация логов ошибок
      new winston.transports.File({ 
        filename: path.join(logDir, 'error-%DATE%.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      }),
      // Ротация всех логов
      new winston.transports.File({ 
        filename: path.join(logDir, 'combined-%DATE%.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      }),
      // Запись в консоль в development
      ...(process.env.NODE_ENV !== 'production' ? [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ] : [])
    ],
  });

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

  // Инициализация Swagger с экземпляром приложения
  const swaggerService = app.get(SwaggerService);
  swaggerService.initWithApp(app);
  
  await app.listen(process.env.PORT || 5000, '0.0.0.0');
  logger.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
