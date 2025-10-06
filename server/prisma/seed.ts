import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  // Создаем базовые права (permissions)
  const permissions = [
    // pages business
    { key: "pages:locations", description: "Страница: Локации" },
    { key: "pages:clients", description: "Страница: Клиенты" },
    { key: "pages:clients:details", description: "Страница: Клиенты(детальная)" },
    { key: "pages:payments", description: "Страница: Платежи" },
    { key: "pages:lists", description: "Страница: Лист ожидания" },
    { key: "pages:requests", description: "Страница: Заявки" },
    { key: "pages:gantt", description: "Страница: Гант" },
    { key: "pages:cell-rentals", description: "Страница: Аренды ячеек" },
    { key: "pages:cell-rentals:details", description: "Страница: Аренды ячеек(детальная)"},
    { key: "pages:free-cells", description: "Страница: Свободные ячейки" },
    { key: "pages:statistics", description: "Страница: Статистика" },

    // pages management
    { key: "pages:locations-manage", description: "Страница: Настройки локаций" },
    { key: "pages:cells-sizes", description: "Страница: Размеры ячеек" },
    { key: "pages:cells-statuses", description: "Страница: Статусы ячеек" },
    { key: "pages:roles", description: "Страница: Роли" },
    { key: "pages:control-panel", description: "Страница: Панели" },
    { key: "pages:users", description: "Страница: Пользователи" },

    // pages systems
    { key: "pages:api-docs", description: "Страница: API Документация" },
    { key: "pages:logs", description: "Страница: Логи" },

    // permissions controls

    // clients
    { key: "clients:read", description: "Просмотр клиентов" },
    { key: "clients:details", description: "Просмотр детальной информации о клиенте" },
    { key: "clients:read-deleted", description: "Просмотр удаленных клиентов" },
    { key: "clients:create", description: "Создание клиентов" },
    { key: "clients:update", description: "Редактирование клиентов" },
    { key: "clients:delete", description: "Удаление клиентов" },
    { key: "clients:force-delete", description: "Удаление клиентов(полное)" },
    { key: "clients:restore", description: "Восстановление клиента" },

    // payments
    { key: "payments:read", description: "Просмотр платежей" },
    { key: "payments:read-deleted", description: "Просмотр удаленных платежей" },
    { key: "payments:create", description: "Создание платежей" },
    { key: "payments:update", description: "Редактирование платежей" },
    { key: "payments:delete", description: "Удаление платежей" },
    { key: "payments:force-delete", description: "Удаление платежей(полное)" },
    { key: "payments:restore", description: "Восстановление платежа" },

    // list 
    { key: "list:read", description: "Просмотр листа ожидания" },
    { key: "list:details", description: "Просмотр детальной информации в листе ожидания" },
    { key: "list:read-deleted", description: "Просмотр удаленных записей из листа ожидания" },
    { key: "list:create", description: "Создание в листе ожидания" },
    { key: "list:delete", description: "Удаление из листа ожидания" },
    { key: "list:force-delete", description: "Удаление из листа ожидания(полное)" },
    { key: "list:restore", description: "Восстановление записи из листа ожидания" },

    // requests
    { key: "requests:read", description: "Просмотр заявок" },
    { key: "requests:details", description: "Просмотр детальной информации в заявках" },
    { key: "requests:read-deleted", description: "Просмотр удаленных записей в заявках" },
    { key: "requests:delete", description: "Удаление из заявок" },
    { key: "requests:force-delete", description: "Удаление из заявок(полное)" },
    { key: "requests:restore", description: "Восстановление записи из заявок" },

    // cell-rentals
    { key: "cell-rentals:read", description: "Просмотр аренд ячеек" },
    { key: "cell-rentals:read-deleted", description: "Просмотр удаленных аренд ячеек" },
    { key: "cell-rentals:create", description: "Создание аренды ячеек" },
    { key: "cell-rentals:update", description: "Редактирование аренды ячеек" },
    { key: "cell-rentals:delete", description: "Удаление аренды ячеек" },
    { key: "cell-rentals:force-delete", description: "Удаление аренд ячеек(полное)" },
    { key: "cell-rentals:restore", description: "Восстановление аренд ячеек" },

    // city
    { key: "city:read", description: "Просмотр городов" },
    { key: "city:read-deleted", description: "Просмотр удаленных записей в городах" },
    { key: "city:create", description: "Создание в городах" },
    { key: "city:update", description: "Редактирование городов" },
    { key: "city:delete", description: "Удаление из городов" },
    { key: "city:force-delete", description: "Удаление из городов(полное)" },
    { key: "city:restore", description: "Восстановление записи из городов" },

    // locations
    { key: "locations:read", description: "Просмотр локаций" },
    { key: "locations:read-deleted", description: "Просмотр удаленных записей в локациях" },
    { key: "locations:create", description: "Создание в локациях" },
    { key: "locations:update", description: "Редактирование локаций" },
    { key: "locations:delete", description: "Удаление из локаций" },
    { key: "locations:force-delete", description: "Удаление из локаций(полное)" },
    { key: "locations:restore", description: "Восстановление записи в локациях" },

    // containers
    { key: "containers:read", description: "Просмотр контейнеров" },
    { key: "containers:read-deleted", description: "Просмотр удаленных записей в контейнерах" },
    { key: "containers:create", description: "Создание в контейнерах" },
    { key: "containers:update", description: "Редактирование контейнеров" },
    { key: "containers:delete", description: "Удаление из контейнеров" },
    { key: "containers:force-delete", description: "Удаление из контейнеров(полное)" },
    { key: "containers:restore", description: "Восстановление записи в контейнерах" },

    // cells
    { key: "cells:read", description: "Просмотр ячеек" },
    { key: "cells:read-deleted", description: "Просмотр удаленных записей в ячейках" },
    { key: "cells:create", description: "Создание в ячейках" },
    { key: "cells:update", description: "Редактирование ячеек" },
    { key: "cells:delete", description: "Удаление ячеек" },
    { key: "cells:force-delete", description: "Удаление из ячеек(полное)" },
    { key: "cells:restore", description: "Восстановление записи в ячейках" },

    // sizes
    { key: "sizes:read", description: "Просмотр размеров" },
    { key: "sizes:read-deleted", description: "Просмотр удаленных записей в размерах" },
    { key: "sizes:create", description: "Создание размера" },
    { key: "sizes:update", description: "Редактирование размеров" },
    { key: "sizes:delete", description: "Удаление размера" },
    { key: "sizes:force-delete", description: "Удаление размера(полное)" },
    { key: "sizes:restore", description: "Восстановление записи в размерах" },

    // users
    { key: "users:read", description: "Просмотр пользователей" },
    { key: "users:details", description: "Просмотр детальной информации о пользователе" },
    { key: "users:read-deleted", description: "Просмотр удаленных пользователей" },
    { key: "users:create", description: "Создание пользователей" },
    { key: "users:update", description: "Редактирование пользователей" },
    { key: "users:delete", description: "Удаление пользователей" },
    { key: "users:force-delete", description: "Удаление пользователей(полное)" },
    { key: "users:restore", description: "Восстановление пользователей" },
    { key: "users:set-roles", description: "Установка ролей и доступов" },
  ];

  await prisma.permission.deleteMany({})

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission,
    });
  }

  const superAdminExists = await prisma.user.findFirst({
    where: { email: 'superadmin@admin.com' },
  });

  if (!superAdminExists) {
    const superAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@admin.com',
        password: await hashPassword('ZT2NHzji9s'),
        role: 'SUPERADMIN',
      },
    });

    await prisma.admin.create({
      data: {
        userId: superAdminUser.id,
      },
    });
    
    console.log('✅ Супер Администратор и профиль созданы');
  }

  console.log('✅ База данных заполнена');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 