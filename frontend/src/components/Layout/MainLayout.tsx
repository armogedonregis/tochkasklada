'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Navigation } from '../Navigation/Navigation';
import ProfileButton from '../auth/ProfileButton';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      // Закрываем с анимацией
      setIsClosing(true);
      setTimeout(() => {
        setIsMobileMenuOpen(false);
        setIsClosing(false);
      }, 300); // Время анимации
    } else {
      // Открываем с анимацией
      setIsMobileMenuOpen(true);
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
      }, 50); // Небольшая задержка для запуска анимации
    }
  };

  const closeMobileMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // Обработка свайпов
  const minSwipeDistance = 10;

  // Обработка свайпов только для основного контента
  const onContentTouchStart = (e: React.TouchEvent) => {
    // Убираем обработку свайпов для открытия меню
    // setTouchEnd(null);
    // setTouchStart(e.targetTouches[0].clientX);
  };

  const onContentTouchMove = (e: React.TouchEvent) => {
    // Убираем обработку свайпов для открытия меню
    // if (!isMobileMenuOpen) {
    //   setTouchEnd(e.targetTouches[0].clientX);
    // }
  };

  const onContentTouchEnd = () => {
    // Убираем обработку свайпов для открытия меню
    // if (!touchStart || !touchEnd || isMobileMenuOpen) return;

    // const distance = touchStart - touchEnd;
    // const isRightSwipe = distance < -minSwipeDistance;

    // if (isRightSwipe) {
    //   // Открываем с анимацией
    //   setIsMobileMenuOpen(true);
    //   setIsOpening(true);
    //   setTimeout(() => {
    //     setIsOpening(false);
    //   }, 50);
    // }
  };

  // Обработка свайпов для мобильного меню
  const onMenuTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onMenuTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onMenuTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Мобильное меню (overlay) */}
      {(isMobileMenuOpen || isClosing) && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className={`fixed inset-0 bg-black mobile-overlay-transition ${isClosing ? 'opacity-0' :
                isOpening ? 'opacity-0' : 'opacity-50'
              }`}
            onClick={closeMobileMenu}
          />
          <div
            ref={mobileMenuRef}
            className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl mobile-menu-transition ${isClosing ? 'transform -translate-x-full' :
                isOpening ? 'transform -translate-x-full' : 'transform translate-x-0'
              }`}
            onTouchStart={onMenuTouchStart}
            onTouchMove={onMenuTouchMove}
            onTouchEnd={onMenuTouchEnd}
          >
            <Navigation
              initialIsOpen={true}
              isMobile={true}
              onClose={closeMobileMenu}
            />
          </div>
        </div>
      )}

      {/* Индикатор свайпа для мобильных устройств */}
      {/* <div className="fixed left-2 top-1/2 transform -translate-y-1/2 z-30 lg:hidden">
        <div className="w-1 h-16 bg-gray-300 dark:bg-gray-600 rounded-full opacity-60"></div>
      </div> */}

      {/* Боковая навигация (скрыта на мобильных) */}
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0 z-20">
        <Navigation initialIsOpen={true} />
      </div>

      {/* Основной контент */}
      <div
        className="flex flex-col flex-1 w-0 overflow-hidden touch-manipulation"
        onTouchStart={onContentTouchStart}
        onTouchMove={onContentTouchMove}
        onTouchEnd={onContentTouchEnd}
      >
        {/* Верхняя панель */}
        <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 flex-shrink-0">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            {/* Мобильная кнопка меню */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white touch-manipulation"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              <div className="flex items-center">
                <span className="text-xl font-bold text-[#F62D40] dark:text-[#F8888F]">Точка.</span>
                <span className="text-xl font-bold ml-1 text-gray-900 dark:text-white">Склада</span>
              </div>
            </h1>
            <div className="flex items-center space-x-4">
              <ProfileButton />
            </div>
          </div>
        </header>

        {/* Контент страницы (с прокруткой) */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 