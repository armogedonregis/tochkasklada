'use client';

import React, { ReactNode } from 'react';
import { Navigation } from '../Navigation/Navigation';
import ProfileButton from '../auth/ProfileButton';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Боковая навигация (фиксированная) */}
      <div className="h-screen sticky top-0 flex-shrink-0 z-20">
        <Navigation initialIsOpen={true} />
      </div>

      {/* Основной контент */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Верхняя панель */}
        <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10 flex-shrink-0">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
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
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 