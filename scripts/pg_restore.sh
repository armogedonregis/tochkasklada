#!/usr/bin/env bash
# Скрипт восстанавливает БД Postgres из бэкапа

set -euo pipefail

# ——— ПАРАМЕТРЫ ———
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/postgres"}
DB_NAME=${POSTGRES_DB:-"postgres"}
COMPOSE_PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ——— ПРОВЕРКА АРГУМЕНТОВ ———
if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# ——— ПРОВЕРКА ФАЙЛА ———
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

cd "$COMPOSE_PROJECT_DIR"

# ——— ВОССТАНОВЛЕНИЕ ———
echo "Restoring database $DB_NAME from: $BACKUP_FILE"

# Восстанавливаем базу (контейнеры продолжают работать)
gunzip -c "$BACKUP_FILE" | docker compose exec -T postgres psql -U "${POSTGRES_USER:-postgres}" "$DB_NAME"

echo "Restore completed successfully!" 