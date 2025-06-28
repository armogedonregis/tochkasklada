FROM node:20-slim AS deps
# устанавливаем OpenSSL для Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# копируем только файлы зависимостей для кеширования
COPY package*.json ./
RUN npm ci --force

FROM deps AS builder
# копируем исходники
COPY . .
RUN npx prisma generate
RUN npm run build

# убираем dev-зависимости для рантайма
RUN npm prune --production --force

FROM node:20-slim AS runner
WORKDIR /app

# устанавливаем OpenSSL для Prisma в рантайме
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# копируем только нужное для рантайма
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# устанавливаем bcrypt в рантайме (как в рабочем примере)
RUN npm install bcrypt --force

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/main.js"] 