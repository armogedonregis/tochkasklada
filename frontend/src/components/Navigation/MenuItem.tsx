'use client';

import { useState } from 'react';

export enum Pages {
  franchasing = 'franchasing',
  locs = 'locs',
  clients = 'clients',
  payments = 'payments',
  settings = 'settings',
  profile = 'profile',
  logout = 'logout',
  sizes = 'sizes',
  tinkoffTest = 'tinkoffTest',
  cellStatuses = 'cellStatuses',
  panels = 'panels',
  freeCells = 'freeCells',
  cellRentals = 'cellRentals',
  apiDocs = 'apiDocs',
  statistics = 'statistics',
  logs = 'logs',
  gantt = 'gantt',
  list = 'list',
  requests = 'requests',
  roles = 'roles',
  users = 'users'
  // Добавьте другие необходимые страницы из вашего Flutter-проекта
}

interface MenuItemProps {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  pageName: string;
  page: Pages;
  newItems?: number;
  goto?: boolean;
  isNavOpened?: boolean;
  currentPage?: Pages | null;
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  activeIcon,
  pageName,
  page,
  newItems = 0,
  goto = false,
  isNavOpened = true,
  currentPage,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isActive = currentPage === page;

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) { // Только для десктопа
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) { // Только для десктопа
      setIsHovered(false);
    }
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    // Добавляем небольшую задержку для лучшего UX
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
  };

  return (
    <div
      className={`w-full h-11 cursor-pointer transition-all duration-200 ease-in-out px-4 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        } ${isPressed ? 'bg-gray-200 dark:bg-gray-700' : ''
        } rounded-2xl active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={onClick}
    >
      <div className="flex items-center h-full px-2">
        <div className="flex items-center justify-center w-7 h-7">
          {isHovered || isActive ? activeIcon : icon}
        </div>

        {isNavOpened && (
          <div className="flex flex-grow items-center justify-between">
            <span
              className={`ml-4 text-sm font-medium transition-all duration-150 no-select ${isHovered
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-white'
                }`}
            >
              {pageName}
            </span>

            {newItems > 0 && (
              <div className="flex items-center justify-center min-w-8 h-8 bg-blue-500 text-white rounded-xl px-2">
                <span className="text-sm font-semibold">{newItems}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 