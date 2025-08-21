import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  // Создаем базовые права (permissions)
  const permissions = [
    // Управление ячейками
    { key: 'cells:read', description: 'Просмотр ячеек' },
    { key: 'cells:create', description: 'Создание ячеек' },
    { key: 'cells:update', description: 'Редактирование ячеек' },
    { key: 'cells:delete', description: 'Удаление ячеек' },
    
    // Управление арендами
    { key: 'rentals:read', description: 'Просмотр аренд' },
    { key: 'rentals:create', description: 'Создание аренд' },
    { key: 'rentals:update', description: 'Редактирование аренд' },
    { key: 'rentals:delete', description: 'Удаление аренд' },
    
    // Управление клиентами
    { key: 'clients:read', description: 'Просмотр клиентов' },
    { key: 'clients:create', description: 'Создание клиентов' },
    { key: 'clients:update', description: 'Редактирование клиентов' },
    { key: 'clients:delete', description: 'Удаление клиентов' },
    
    // Управление заявками
    { key: 'requests:read', description: 'Просмотр заявок' },
    { key: 'requests:update', description: 'Редактирование заявок' },
    { key: 'requests:close', description: 'Закрытие заявок' },
    
    // Управление списками ожидания
    { key: 'lists:read', description: 'Просмотр списков ожидания' },
    { key: 'lists:create', description: 'Создание списков ожидания' },
    { key: 'lists:update', description: 'Редактирование списков ожидания' },
    { key: 'lists:close', description: 'Закрытие списков ожидания' },
    
    // Управление платежами
    { key: 'payments:read', description: 'Просмотр платежей' },
    { key: 'payments:create', description: 'Создание платежей' },
    { key: 'payments:update', description: 'Редактирование платежей' },
    { key: 'payments:delete', description: 'Удаление платежей' },
    
    // Управление локациями
    { key: 'locations:read', description: 'Просмотр локаций' },
    { key: 'locations:create', description: 'Создание локаций' },
    { key: 'locations:update', description: 'Редактирование локаций' },
    { key: 'locations:delete', description: 'Удаление локаций' },
    
    // Управление контейнерами
    { key: 'containers:read', description: 'Просмотр контейнеров' },
    { key: 'containers:create', description: 'Создание контейнеров' },
    { key: 'containers:update', description: 'Редактирование контейнеров' },
    { key: 'containers:delete', description: 'Удаление контейнеров' },

    // Управление ролями
    { key: 'roles:read', description: 'Просмотр ролей' },
    { key: 'roles:create', description: 'Создание ролей' },
    { key: 'roles:update', description: 'Редактирование ролей' },
    { key: 'roles:delete', description: 'Удаление ролей' },
    { key: 'roles:assign', description: 'Назначение ролей' },

    // Управление пользователями
    { key: 'users:read', description: 'Просмотр пользователей' },
    { key: 'users:create', description: 'Создание пользователей' },
    { key: 'users:update', description: 'Редактирование пользователей' },
    { key: 'users:delete', description: 'Удаление пользователей' },

    // Управление правами
    { key: 'permissions:read', description: 'Просмотр прав доступа' },
    { key: 'permissions:assign', description: 'Назначение прав доступа' },

    // Системные права
    { key: 'system:admin', description: 'Полный доступ к системе' },
    { key: 'system:logs', description: 'Просмотр логов системы' },
    { key: 'system:settings', description: 'Настройки системы' },
  ];

  // Создаем права в базе
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission,
    });
  }

  // Создаем роль SUPERADMIN
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: { 
      name: 'SUPERADMIN',
      description: 'Супер администратор с полными правами'
    },
  });

  // Создаем супер-администратора
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

    // Создаем профиль администратора
    const adminProfile = await prisma.admin.create({
      data: {
        userId: superAdminUser.id,
      },
    });

    // Назначаем роль SUPERADMIN через AdminRole
    await prisma.adminRole.create({
      data: {
        adminId: adminProfile.id,
        roleId: superAdminRole.id,
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