'use client';

import React, { ReactNode } from 'react';
import { Navigation } from '../Navigation/Navigation';
import { UserAvatar } from '../UserAvatar';
import ProfileButton from '../auth/ProfileButton';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Боковая навигация (импорт из Flutter) */}
      <Navigation initialIsOpen={true} />

      {/* Основной контент */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Верхняя панель */}
        <header className="bg-white dark:bg-gray-800 shadow">
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

        {/* Контент страницы */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 