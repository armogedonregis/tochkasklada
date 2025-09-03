// Типы для конфигурации навигации
export interface NavigationItem {
  id: string;
  name: string;
  href?: string;
  iconKey: string; // Ключ иконки из navigationIcons
  permission: string | string[]; // Может быть одно право или массив прав
  onClick?: () => void;
  className?: string;
  newItems?: number;
  requireSuperAdmin?: boolean; // Специальная проверка для SUPERADMIN
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
  className?: string;
}

// Конфигурация навигации
export const navigationConfig: NavigationSection[] = [
  {
    id: 'business',
    title: 'Бизнес',
    items: [
      {
        id: 'franchising',
        name: 'Франчайзинг',
        href: '/',
        iconKey: 'briefcase',
        permission: 'system:admin',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
      {
        id: 'locations-view',
        name: 'Локации',
        href: '/locations',
        iconKey: 'locations',
        permission: 'locations:read',
        className: 'hidden md:block',
      },
      {
        id: 'clients',
        name: 'Клиенты',
        href: '/clients',
        iconKey: 'users',
        permission: 'clients:read',
      },
      {
        id: 'payments',
        name: 'Платежи',
        href: '/payments',
        iconKey: 'payments',
        permission: 'payments:read',
      },
      {
        id: 'waiting-list',
        name: 'Лист ожидания',
        href: '/list',
        iconKey: 'list',
        permission: 'lists:read',
        className: 'hidden md:block',
      },
      {
        id: 'requests',
        name: 'Заявки',
        href: '/requests',
        iconKey: 'list',
        permission: 'requests:read',
        className: 'hidden md:block',
      },
      {
        id: 'gantt',
        name: 'Гант',
        href: '/gantt',
        iconKey: 'statistics',
        permission: 'gantt:read',
        className: 'hidden md:block',
      },
      {
        id: 'cell-rentals',
        name: 'Аренды ячеек',
        href: '/cell-rentals',
        iconKey: 'cells',
        permission: 'rentals:read',
      },
      {
        id: 'free-cells',
        name: 'Свободные ячейки',
        href: '/free-cells',
        iconKey: 'cells',
        permission: 'cells:read',
      },
      {
        id: 'statistics',
        name: 'Статистика',
        href: '/statistics',
        iconKey: 'statistics',
        permission: 'statistics:read',
        className: 'hidden md:block',
      },
    ],
  },
  {
    id: 'management',
    title: 'Управление',
    items: [
      {
        id: 'locations-manage',
        name: 'Города',
        href: '/control/locations',
        iconKey: 'locations',
        permission: ['locations:create', 'locations:update', 'locations:delete'],
        className: 'hidden md:block',
      },
      {
        id: 'locations-control',
        name: 'Локации (управление)',
        href: '/control/locations/locations',
        iconKey: 'locations',
        permission: ['locations:create', 'locations:update', 'locations:delete'],
        className: 'hidden md:block',
      },
      {
        id: 'sizes',
        name: 'Размеры',
        href: '/sizes',
        iconKey: 'sizes',
        permission: ['sizes:read', 'sizes:create', 'sizes:update'],
        className: 'hidden md:block',
      },
      {
        id: 'cell-statuses',
        name: 'Статусы ячеек',
        href: '/cell-statuses',
        iconKey: 'statuses',
        permission: ['cell-statuses:read', 'cell-statuses:create', 'cell-statuses:update'],
        className: 'hidden md:block',
      },
      {
        id: 'settings',
        name: 'Настройки',
        href: '/settings',
        iconKey: 'settings',
        permission: 'settings:read',
        className: 'hidden md:block',
      },
      {
        id: 'roles',
        name: 'Роли',
        href: '/roles',
        iconKey: 'roles',
        permission: 'roles:read',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
      {
        id: 'tinkoff-test',
        name: 'Тест Тбанк',
        href: '/tinkoff-test',
        iconKey: 'payments', // Используем иконку платежей
        permission: 'system:admin',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
      {
        id: 'panels',
        name: 'Панели',
        href: '/panels',
        iconKey: 'panels',
        permission: 'panels:read',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
      {
        id: 'users',
        name: 'Пользователи',
        href: '/users',
        iconKey: 'users',
        permission: 'users:read',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
    ],
  },
  {
    id: 'system',
    title: 'Система',
    items: [
      {
        id: 'api-docs',
        name: 'API Документация',
        href: '/docs',
        iconKey: 'documentation',
        permission: 'system:settings',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
      {
        id: 'logs',
        name: 'Логи',
        href: '/logs',
        iconKey: 'database',
        permission: 'system:logs',
        className: 'hidden md:block',
        requireSuperAdmin: true,
      },
    ],
  },
  {
    id: 'user',
    title: 'Пользователь',
    items: [
      {
        id: 'profile',
        name: 'Профиль',
        href: '/profile',
        iconKey: 'profile',
        permission: [], // Доступен всем
      },
      {
        id: 'logout',
        name: 'Выход',
        iconKey: 'logout',
        permission: [], // Доступен всем
      },
    ],
  },
];
