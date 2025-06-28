FROM node:20-slim AS deps
RUN npm install -g pnpm
WORKDIR /app

# копируем только файлы зависимостей для кеширования
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
# копируем исходники
COPY . .
RUN pnpm build

# убираем dev-зависимости для рантайма
RUN pnpm prune --prod

FROM node:20-slim AS runner
WORKDIR /app

# копируем только нужное для рантайма
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"] 