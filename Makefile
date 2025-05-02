.PHONY: up down build rebuild logs ps

# Запуск контейнеров
up:
	docker-compose up -d

# Остановка контейнеров
down:
	docker-compose down

# Сборка контейнеров
build:
	docker-compose build

# Пересборка и запуск контейнеров
rebuild:
	docker-compose down
	docker-compose build
	docker-compose up -d

# Просмотр логов
logs:
	docker-compose logs -f

# Просмотр запущенных контейнеров
ps:
	docker-compose ps

# Применение миграций Prisma
migrate:
	docker-compose exec api pnpm prisma migrate deploy
	docker-compose exec api pnpm prisma generate

# Генерация миграции Prisma
migrate-dev:
	docker-compose exec api pnpm prisma migrate dev

# Запуск Prisma Studio
studio:
	docker-compose exec api pnpm prisma studio

# Запуск seed данных
seed:
	docker-compose exec api pnpm prisma db seed 