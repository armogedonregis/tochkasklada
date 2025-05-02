FROM node:18-alpine AS builder

WORKDIR /app

# Копирование файлов для установки зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

# Установка окружения
ENV NODE_ENV production

# Копирование необходимых файлов из предыдущего этапа
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Экспорт порта
EXPOSE 3000

# Запуск приложения
CMD ["npm", "start"] 