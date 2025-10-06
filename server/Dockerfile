FROM node:20-slim AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS builder

COPY . .

RUN apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

RUN npx prisma generate
RUN npm install bcrypt
RUN npm run build
RUN npx tsc prisma/seed.ts --outDir . --target ES2020 --module commonjs --esModuleInterop --skipLibCheck
RUN npm prune --production

FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

RUN chown -R node:node /app && \
    chmod -R 755 /app

RUN npm install -g ts-node

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER node

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/main.js"] 