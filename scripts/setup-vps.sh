#!/bin/bash

# Скрипт для первоначальной настройки VPS
# Выполните этот скрипт на вашем VPS перед первым деплоем

# Обновление системы
apt-get update
apt-get upgrade -y

# Установка необходимых пакетов
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    make

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Создание пользователя для деплоя (если нужно)
# adduser deploy
# usermod -aG docker deploy
# usermod -aG sudo deploy

# Создание директории проекта
mkdir -p /var/www/app
cd /var/www/app

# Клонирование репозитория (замените URL на свой)
# git clone https://github.com/your-username/your-repo.git .

echo "Настройка сервера завершена. Теперь вы можете настроить GitHub Actions"
echo "и выполнить первый деплой вашего приложения." 