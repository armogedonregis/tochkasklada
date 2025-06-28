#!/usr/bin/env bash
# Скрипт делает дамп всех БД Postgres из docker-compose-сервиса «postgres»
# и хранит их заданное число дней.

set -euo pipefail

# ——— ПАРАМЕТРЫ ———
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/postgres"}   # куда складывать (можно переопределить переменной окружения)
KEEP_DAYS=${KEEP_DAYS:-7}                            # сколько дней хранить бэкапы
COMPOSE_PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"   # корень проекта (где docker-compose.yml)

# ——— ПОДГОТОВКА ———
mkdir -p "$BACKUP_DIR"
DATE=$(date +"%Y-%m-%d_%H-%M-")
FILE="$BACKUP_DIR/${DATE}dump.sql.gz"

cd "$COMPOSE_PROJECT_DIR"

# ——— ДАМП ———
# Используем pg_dumpall внутри контейнера, -T (no-TTY) важно для cron

docker compose exec -T postgres pg_dumpall -U "${POSTGRES_USER:-postgres}" | gzip > "$FILE"

# ——— ОЧИСТКА СТАРЫХ БЭКАПОВ ———
find "$BACKUP_DIR" -type f -name "*dump.sql.gz" -mtime +"$KEEP_DAYS" -delete

echo "Backup finished: $FILE (old >${KEEP_DAYS}d removed)" 