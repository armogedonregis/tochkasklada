#!/usr/bin/env bash
# Скрипт делает дамп основной БД Postgres из docker-compose-сервиса «postgres»
# и хранит их заданное число дней.

set -euo pipefail

# ——— ПАРАМЕТРЫ ———
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/postgres"}   # куда складывать (можно переопределить переменной окружения)
KEEP_DAYS=${KEEP_DAYS:-7}                            # сколько дней хранить локальные бэкапы
COMPOSE_PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"   # корень проекта (где docker-compose.yml)
DB_NAME=${POSTGRES_DB:-"postgres"}                   # имя базы данных

# Яндекс.Диск через REST API (OAuth токен)
# Можно задать через /etc/backup-yadisk.env или переменные окружения окружения
YANDEX_TOKEN=${YANDEX_TOKEN:-""}
YANDEX_REMOTE_DIR=${YANDEX_REMOTE_DIR:-"/backup_tochka"}  # удалённая папка на Я.Диске

# (опционально) Подхватываем секреты из /etc/backup-yadisk.env (если файл существует)
if [ -f /etc/backup-yadisk.env ]; then
  set -a
  . /etc/backup-yadisk.env
  set +a
  # Переприсваиваем, если появились значения из файла
  YANDEX_TOKEN=${YANDEX_TOKEN:-""}
  YANDEX_REMOTE_DIR=${YANDEX_REMOTE_DIR:-"/backup_tochka"}
fi

# ——— ПОДГОТОВКА ———
mkdir -p "$BACKUP_DIR"
DATE=$(date +"%Y-%m-%d_%H-%M-")
FILE="$BACKUP_DIR/${DATE}${DB_NAME}.sql.gz"

cd "$COMPOSE_PROJECT_DIR"

# Используем pg_dump для конкретной БД, -T (no-TTY) важно для cron
echo "Creating backup of database: $DB_NAME"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-postgres}" "$DB_NAME" | gzip > "$FILE"
echo "Local backup finished: $FILE"

# ——— ВЫГРУЗКА НА ЯНДЕКС.ДИСК ———
if [ -n "$YANDEX_TOKEN" ]; then

  urlencode() {
    local LANG=C s="$1" i c out=""
    for ((i=0; i<${#s}; i++)); do
      c="${s:i:1}"
      case "$c" in [a-zA-Z0-9.~_-]) out+="$c" ;; *) printf -v hex '%%%02X' "'$c"; out+="$hex" ;; esac
    done
    printf '%s' "$out"
  }

  # Создаём удалённую папку (идемпотентно)
  ENC_DIR="$(urlencode "$YANDEX_REMOTE_DIR")"
  MKDIR_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: OAuth $YANDEX_TOKEN" \
    -X PUT "https://cloud-api.yandex.net/v1/disk/resources?path=${ENC_DIR}" || true)
  if [ "$MKDIR_CODE" != "201" ] && [ "$MKDIR_CODE" != "409" ]; then
    echo "WARN: Cannot ensure remote dir ($MKDIR_CODE) for $YANDEX_REMOTE_DIR"
  fi

  BASENAME=$(basename "$FILE")
  ENC_PATH="$(urlencode "$YANDEX_REMOTE_DIR/$BASENAME")"

  # Получаем href для загрузки
  UPLOAD_JSON=$(curl -sf -H "Authorization: OAuth $YANDEX_TOKEN" \
    "https://cloud-api.yandex.net/v1/disk/resources/upload?path=${ENC_PATH}&overwrite=true")
  # Достаём href без jq
  HREF=$(printf '%s' "$UPLOAD_JSON" | sed -n 's/.*"href":"\([^"]*\)".*/\1/p')
  if [ -z "$HREF" ]; then
    echo "ERROR: Cannot parse upload href from API response"
    echo "$UPLOAD_JSON"
    exit 1
  fi

  # Загружаем файл
  curl -sf -T "$FILE" "$HREF"
  echo "Uploaded to Yandex.Disk: $YANDEX_REMOTE_DIR/$BASENAME"
else
  echo "YANDEX_TOKEN is not set. Skipping upload to Yandex.Disk."
fi

# ——— ОЧИСТКА СТАРЫХ БЭКАПОВ ———
find "$BACKUP_DIR" -type f -name "*${DB_NAME}.sql.gz" -mtime +"$KEEP_DAYS" -delete

echo "Backup finished: $FILE (old >${KEEP_DAYS}d removed)" 