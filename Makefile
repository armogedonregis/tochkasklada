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

# Установка прав на выполнение скриптов
fix-permissions:
	chmod +x scripts/*.sh

# Применение миграций Prisma
migrate:
	@echo "Waiting for PostgreSQL to be ready..."
	@timeout 60 bash -c 'until docker-compose exec -T postgres pg_isready -U postgres; do sleep 2; done'
	@echo "Applying Prisma migrations..."
	docker-compose exec -T api sh -c "cd /app && npm run migrate:prod"

# Генерация миграции Prisma
migrate-dev:
	docker-compose exec -T api sh -c "cd /app && npx prisma migrate dev"

# Запуск Prisma Studio
studio:
	docker-compose exec -T api sh -c "cd /app && npx prisma studio"

# Запуск seed данных
seed:
	docker-compose exec -T api sh -c "cd /app && npx prisma db seed" 