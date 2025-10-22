import {
  HomeIcon,
  UsersIcon,
  MapIcon,
  CreditCardIcon,
  BriefcaseIcon,
  CogIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  RectangleStackIcon,
  ListBulletIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CubeIcon,
  TagIcon,
  Squares2X2Icon,
  CircleStackIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeSolid,
  UsersIcon as UsersSolid,
  MapIcon as MapSolid,
  CreditCardIcon as CreditCardSolid,
  BriefcaseIcon as BriefcaseSolid,
  CogIcon as CogSolid,
  UserCircleIcon as UserCircleSolid,
  RectangleStackIcon as RectangleStackSolid,
  ListBulletIcon as ListBulletSolid,
  ChartBarIcon as ChartBarSolid,
  DocumentTextIcon as DocumentTextSolid,
  ShieldCheckIcon as ShieldCheckSolid,
  CubeIcon as CubeSolid,
  TagIcon as TagSolid,
  Squares2X2Icon as Squares2X2Solid,
  CircleStackIcon as CircleStackSolid,
} from '@heroicons/react/24/solid';

// Типы для иконок
export interface IconConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Централизованный объект с иконками для навигации
export const navigationIcons: Record<string, IconConfig> = {
  // Основные бизнес-функции
  home: {
    icon: HomeIcon,
    activeIcon: HomeSolid,
  },
  
  users: {
    icon: UsersIcon,
    activeIcon: UsersSolid,
  },
  
  locations: {
    icon: MapIcon,
    activeIcon: MapSolid,
  },

  mail: {
    icon: EnvelopeIcon, // Импортируйте из heroicons
    activeIcon: EnvelopeIcon, // или создайте solid версию
  },
  
  payments: {
    icon: CreditCardIcon,
    activeIcon: CreditCardSolid,
  },
  
  briefcase: {
    icon: BriefcaseIcon,
    activeIcon: BriefcaseSolid,
  },

  // Списки и документы
  list: {
    icon: ListBulletIcon,
    activeIcon: ListBulletSolid,
  },
  
  // Статистика и аналитика
  statistics: {
    icon: ChartBarIcon,
    activeIcon: ChartBarSolid,
  },
  
  // Документация
  documentation: {
    icon: DocumentTextIcon,
    activeIcon: DocumentTextSolid,
  },
  
  // Безопасность и роли
  roles: {
    icon: ShieldCheckIcon,
    activeIcon: ShieldCheckSolid,
  },
  
  // Настройки и конфигурация
  settings: {
    icon: CogIcon,
    activeIcon: CogSolid,
  },
  
  // Размеры и конфигурация
  sizes: {
    icon: CubeIcon,
    activeIcon: CubeSolid,
  },
  
  // Статусы и теги
  statuses: {
    icon: TagIcon,
    activeIcon: TagSolid,
  },
  
  // Панели и сетки
  panels: {
    icon: Squares2X2Icon,
    activeIcon: Squares2X2Solid,
  },
  
  // Ячейки и хранилище
  cells: {
    icon: RectangleStackIcon,
    activeIcon: RectangleStackSolid,
  },
  
  // Базы данных и логи
  database: {
    icon: CircleStackIcon,
    activeIcon: CircleStackSolid,
  },
  
  // Аудит и безопасность
  audit: {
    icon: ShieldCheckIcon,
    activeIcon: ShieldCheckSolid,
  },
  
  // Профиль пользователя
  profile: {
    icon: UserCircleIcon,
    activeIcon: UserCircleSolid,
  },
  
  // Выход
  logout: {
    icon: ArrowRightOnRectangleIcon,
    activeIcon: ArrowRightOnRectangleIcon, // Для logout используем одну иконку
  },
};

// Иконки для управления интерфейсом (не требуют активного состояния)
export const interfaceIcons = {
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  close: XMarkIcon,
  sun: SunIcon,
  moon: MoonIcon,
} as const;

// Хелпер для получения иконок с правильными классами
export const getNavigationIcon = (
  iconKey: keyof typeof navigationIcons,
  isActive: boolean = false,
  className: string = "w-5 h-5"
) => {
  const iconConfig = navigationIcons[iconKey];
  if (!iconConfig) return null;
  
  const IconComponent = isActive ? iconConfig.activeIcon : iconConfig.icon;
  return <IconComponent className={className} />;
};

// Хелпер для интерфейсных иконок
export const getInterfaceIcon = (
  iconKey: keyof typeof interfaceIcons,
  className: string = "w-5 h-5"
) => {
  const IconComponent = interfaceIcons[iconKey];
  if (!IconComponent) return null;
  
  return <IconComponent className={className} />;
};
