FROM node:20-slim AS deps
RUN npm install -g pnpm
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder

COPY . .
RUN pnpm build

RUN pnpm prune --prod

FROM node:20-slim AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]