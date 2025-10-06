'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from './MenuItem';
import { useTheme } from '@/lib/theme-provider';
import { useGetRequestsStatsQuery } from '@/services/requestsService/requestsApi';
import { navigationConfig } from './navigationConfig';
import { useNavigationAccess } from './useNavigationAccess';
import { getInterfaceIcon } from './icons';

import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slice/userSlice';

interface NavigationProps {
  initialIsOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  initialIsOpen = true,
  isMobile = false,
  onClose,
}) => {
  const [isNavOpened, setIsNavOpened] = useState(initialIsOpen);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { canAccessItem, isSuperAdmin } = useNavigationAccess();
  const { data: requestsStats } = useGetRequestsStatsQuery();
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isMobile || !onClose) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  useEffect(() => {
    const savedNavState = localStorage.getItem('isNavOpened');
    if (savedNavState) {
      setIsNavOpened(JSON.parse(savedNavState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isNavOpened', JSON.stringify(isNavOpened));
  }, [isNavOpened]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const toggleNav = () => {
    setIsNavOpened(!isNavOpened);
  };

  const shouldShowFullMenu = isMobile || isNavOpened;

  const getNewItemsCount = (itemId: string) => {
    if (itemId === 'requests') {
      return requestsStats?.byStatus?.WAITING || 0;
    }
    return 0;
  };

  const renderNavigationSections = () => {
    return navigationConfig.map((section) => {
      const accessibleItems = section.items.filter(canAccessItem);
      if (accessibleItems.length === 0) {
        return null;
      }

      if (section.id === 'management' && !isSuperAdmin) {
        const nonSuperAdminItems = accessibleItems.filter(item => !item.requireSuperAdmin);
        if (nonSuperAdminItems.length === 0) {
          return null;
        }
      }

      return (
        <div key={section.id}>
          {shouldShowFullMenu && section.title && section.id !== 'user' && (
            <>
              {section.id === 'management' && (
                <div className="my-4 border-t border-gray-200 lg:block hidden dark:border-gray-700"></div>
              )}
              <div className={`mb-2 ml-4 ${section.className || ''}`}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {section.title}
                </span>
              </div>
            </>
          )}
          {accessibleItems.map((item) => (
            <MenuItem
              key={item.id}
              iconKey={item.iconKey}
              pageName={item.name}
              isNavOpened={shouldShowFullMenu}
              href={item.href}
              onClick={item.id === 'logout' ? handleLogout : item.onClick}
              className={item.className}
              newItems={getNewItemsCount(item.id)}
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out ${isMobile ? 'w-full z-50' : shouldShowFullMenu ? 'w-64' : 'w-20'
        } border-r border-gray-200 dark:border-gray-700`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {shouldShowFullMenu ? (
          <div className="flex items-center">
            <span className="text-xl font-bold text-[#F62D40] dark:text-[#F8888F]">Точка.</span>
            <span className="text-xl font-bold ml-1 text-gray-900 dark:text-white">Склада</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <span className="text-xl font-bold text-[#F62D40] dark:text-[#F8888F]">Т</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {isMobile && onClose && (
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 touch-manipulation"
              onClick={onClose}
            >
              {getInterfaceIcon('close')}
            </button>
          )}
          {!isMobile && (
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white touch-manipulation"
              onClick={toggleNav}
            >
              {isNavOpened ? getInterfaceIcon('chevronLeft') : getInterfaceIcon('chevronRight')}
            </button>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto py-4 px-3 scrollbar-hide navigation-mobile overflow-mobile-fix">
        {renderNavigationSections()}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 navigation-mobile overflow-mobile-fix">
        {shouldShowFullMenu && (
          <div className="mb-2 ml-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Тема
            </span>
          </div>
        )}

        {shouldShowFullMenu ? (
          <div className="mb-4 px-2">
            <div className="hidden md:flex items-center justify-between rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex items-center space-x-2 rounded-md py-1.5 px-2.5 transition-all ${theme === 'light'
                  ? 'bg-gradient-to-r from-[#F62D40] to-[#F8888F] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                {getInterfaceIcon('sun', 'h-4 w-4')}
                <span className="text-xs font-medium">Светлая</span>
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex items-center space-x-2 rounded-md py-1.5 px-2.5 transition-all ${theme === 'dark'
                  ? 'bg-gradient-to-r from-[#F62D40] to-[#F8888F] text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
              >
                {getInterfaceIcon('moon', 'h-4 w-4')}
                <span className="text-xs font-medium">Темная</span>
              </button>
            </div>
            <div className="md:hidden">
              <div className="text-center mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Тема: {theme === 'light' ? 'Светлая' : 'Темная'}
                </span>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1.5 theme-switcher-mobile">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all touch-manipulation ${theme === 'light'
                      ? 'bg-gradient-to-r from-[#F62D40] to-[#F8888F] text-white shadow-lg scale-110 active'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  {getInterfaceIcon('sun', 'h-5 w-5')}
                </button>
                <div className="mx-3 w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all touch-manipulation ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[#F62D40] to-[#F8888F] text-white shadow-lg scale-110 active'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  {getInterfaceIcon('moon', 'h-5 w-5')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm"
            >
              {theme === 'light' ? (
                getInterfaceIcon('sun', 'h-5 w-5 text-[#F62D40]')
              ) : (
                getInterfaceIcon('moon', 'h-5 w-5 text-[#F62D40]')
              )}
            </button>
          </div>
        )}
        {navigationConfig.find(section => section.id === 'user')?.items
          .filter(canAccessItem)
          .map((item) => (
            <MenuItem
              key={item.id}
              iconKey={item.iconKey}
              pageName={item.name}
              isNavOpened={shouldShowFullMenu}
              href={item.href}
              onClick={item.id === 'logout' ? handleLogout : item.onClick}
            />
          ))
        }
      </div>
    </div>
  );
};