FROM node:18-alpine AS builder

WORKDIR /app

# Установка необходимых зависимостей для bcrypt
RUN apk add --no-cache python3 make g++ 

# Установка pnpm
RUN npm install -g pnpm

# Копирование файлов для зависимостей
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Установка зависимостей
RUN pnpm install

# Копирование исходного кода
COPY . .

# Генерация Prisma клиента
RUN pnpm prisma generate

# Сборка приложения
RUN pnpm build

FROM node:18-alpine AS runner

WORKDIR /app

# Установка необходимых зависимостей для bcrypt
RUN apk add --no-cache python3 make g++

# Установка pnpm
RUN npm install -g pnpm

# Копирование необходимых файлов из предыдущего этапа
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Экспорт окружения времени выполнения
ENV NODE_ENV production

# Экспорт порта
EXPOSE 5000

# Запуск сервера
CMD ["pnpm", "start:prod"] 