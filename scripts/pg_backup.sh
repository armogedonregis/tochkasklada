#!/usr/bin/env bash
# Скрипт делает дамп основной БД Postgres из docker-compose-сервиса «postgres»
# и хранит их заданное число дней.

set -euo pipefail

# ——— ПАРАМЕТРЫ ———
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/postgres"}   # куда складывать (можно переопределить переменной окружения)
KEEP_DAYS=${KEEP_DAYS:-7}                            # сколько дней хранить бэкапы
COMPOSE_PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"   # корень проекта (где docker-compose.yml)
DB_NAME=${POSTGRES_DB:-"postgres"}                   # имя базы данных

# ——— ПОДГОТОВКА ———
mkdir -p "$BACKUP_DIR"
DATE=$(date +"%Y-%m-%d_%H-%M-")
FILE="$BACKUP_DIR/${DATE}${DB_NAME}.sql.gz"

cd "$COMPOSE_PROJECT_DIR"

#test

# Используем pg_dump для конкретной БД, -T (no-TTY) важно для cron
echo "Creating backup of database: $DB_NAME"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-postgres}" "$DB_NAME" | gzip > "$FILE"

# ——— ОЧИСТКА СТАРЫХ БЭКАПОВ ———
find "$BACKUP_DIR" -type f -name "*${DB_NAME}.sql.gz" -mtime +"$KEEP_DAYS" -delete

echo "Backup finished: $FILE (old >${KEEP_DAYS}d removed)" 