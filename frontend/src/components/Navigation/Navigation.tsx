'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem, Pages } from './MenuItem';

// Компоненты SVG иконок
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MapIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const CreditCardIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CogIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Добавляем иконку для размеров
const BoxIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

interface NavigationProps {
  initialIsOpen?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  initialIsOpen = true 
}) => {
  const [isNavOpened, setIsNavOpened] = useState(initialIsOpen);
  const [currentPage, setCurrentPage] = useState<Pages | null>(null);
  const router = useRouter();

  // Имитируем данные из Flutter-приложения
  const [dashboardItems, setDashboardItems] = useState({
    freeCells: 5,
    clientsToday: 3,
    clientsThisMonth: 12,
    paymentsToday: 7,
    paymentsThisMonth: 25,
    newUsersToday: 2
  });

  // Имитация сохранения состояния
  useEffect(() => {
    const savedNavState = localStorage.getItem('isNavOpened');
    if (savedNavState) {
      setIsNavOpened(JSON.parse(savedNavState));
    }
    
    const savedCurrentPage = localStorage.getItem('currentPage');
    if (savedCurrentPage) {
      setCurrentPage(savedCurrentPage as Pages);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isNavOpened', JSON.stringify(isNavOpened));
  }, [isNavOpened]);

  useEffect(() => {
    if (currentPage) {
      localStorage.setItem('currentPage', currentPage);
    }
  }, [currentPage]);

  const navigateTo = (page: Pages, path: string) => {
    setCurrentPage(page);
    router.push(path);
  };

  const toggleNav = () => {
    setIsNavOpened(!isNavOpened);
  };

  return (
    <div className={`flex flex-col h-screen bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out ${
      isNavOpened ? 'w-64' : 'w-20'
    } border-r border-gray-200 dark:border-gray-700`}>
      {/* Верхняя часть с логотипом */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isNavOpened ? (
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Точка.</span>
            <span className="text-xl font-bold ml-1 text-gray-900 dark:text-white">Склада</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">R</span>
          </div>
        )}
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          onClick={toggleNav}
        >
          {isNavOpened ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </div>

      {/* Основное меню */}
      <div className="flex-grow overflow-y-auto py-4 px-3">
        {isNavOpened && (
          <div className="mb-2 ml-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Бизнес
            </span>
          </div>
        )}
        
        <MenuItem 
          icon={<BriefcaseIcon className="text-gray-500" />}
          activeIcon={<BriefcaseIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Франчайзинг"
          page={Pages.franchasing}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.franchasing, '/franchasing')}
        />
        
        <MenuItem 
          icon={<MapIcon className="text-gray-500" />}
          activeIcon={<MapIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Локации"
          page={Pages.locs}
          newItems={dashboardItems.freeCells}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.locs, '/locations')}
        />
        
        <MenuItem 
          icon={<UsersIcon className="text-gray-500" />}
          activeIcon={<UsersIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Клиенты"
          page={Pages.clients}
          newItems={dashboardItems.clientsToday}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.clients, '/clients')}
        />
        
        <MenuItem 
          icon={<CreditCardIcon className="text-gray-500" />}
          activeIcon={<CreditCardIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Платежи"
          page={Pages.payments}
          newItems={dashboardItems.paymentsToday}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.payments, '/payments')}
        />

        {/* Разделитель */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
        
        {isNavOpened && (
          <div className="mb-2 ml-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Управление
            </span>
          </div>
        )}
        
        {/* <MenuItem 
          icon={<HomeIcon className="text-gray-500" />}
          activeIcon={<HomeIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Панели"
          page={Pages.panels}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.panels, '/panels')}
        /> */}
        
        <MenuItem 
          icon={<BoxIcon className="text-gray-500" />}
          activeIcon={<BoxIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Размеры"
          page={Pages.sizes}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.sizes, '/sizes')}
        />
        
        <MenuItem 
          icon={<CogIcon className="text-gray-500" />}
          activeIcon={<CogIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Настройки"
          page={Pages.settings}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.settings, '/settings')}
        />
      </div>
      
      {/* Профиль пользователя */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <MenuItem 
          icon={<UserCircleIcon className="text-gray-500" />}
          activeIcon={<UserCircleIcon className="text-blue-600 dark:text-blue-400" />}
          pageName="Профиль"
          page={Pages.profile}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => navigateTo(Pages.profile, '/profile')}
        />
        
        <MenuItem 
          icon={<LogoutIcon className="text-gray-500" />}
          activeIcon={<LogoutIcon className="text-red-600" />}
          pageName="Выход"
          page={Pages.logout}
          isNavOpened={isNavOpened}
          currentPage={currentPage}
          onClick={() => {
            // Логика выхода
            router.push('/');
          }}
        />
      </div>
    </div>
  );
}; 