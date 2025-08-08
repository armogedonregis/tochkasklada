import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/utils/password.utils';

const prisma = new PrismaClient();

async function main() {
  // Создаем администратора
  const superAdminExists = await prisma.user.findFirst({ 
    where: { role: 'SUPERADMIN' } 
  });

  const adminExists = await prisma.user.findFirst({ 
    where: { role: 'ADMIN' } 
  });

  if (!superAdminExists) {
    const superAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@admin.com',
        password: await hashPassword('ZT2NHzji9s'),
        role: 'SUPERADMIN',
      }
    });

    // Создаем профиль администратора
    await prisma.admin.create({
      data: {
        userId: superAdminUser.id,
      }
    });
    
    console.log('✅ Супер Администратор и профиль созданы');
  }

  if(!adminExists) {
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: await hashPassword('admin123'),
        role: 'ADMIN',
      }
    });

    // Создаем профиль администратора
    await prisma.admin.create({
      data: {
        userId: adminUser.id,
      }
    });
    
    console.log('✅ Администратор и профиль созданы');
  }

  console.log('🌱 Сидер выполнен успешно');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при выполнении сидера:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 