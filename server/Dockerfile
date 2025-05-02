FROM node:18-alpine

# Установка необходимых зависимостей
RUN apk add --no-cache python3 make g++
RUN npm install -g pnpm

WORKDIR /app

# Копирование файлов проекта
COPY . .

# Установка зависимостей и сборка
RUN pnpm install
RUN cd prisma && npx prisma generate
RUN pnpm build

# Настраиваем окружение для продакшн
ENV NODE_ENV production
EXPOSE 5000

# Запускаем приложение
CMD ["pnpm", "start:prod"] 