'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type LocationTab = 'cities' | 'locations' | 'containers' | 'cells';

interface LocationLayoutProps {
  children: ReactNode;
  title: string;
  activeTab: LocationTab;
  onSearch: (query: string) => void;
  searchQuery: string;
  onAddItem: () => void;
}

export const LocationLayout: React.FC<LocationLayoutProps> = ({
  children,
  title,
  activeTab,
  onSearch,
  searchQuery,
  onAddItem
}) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок страницы */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex overflow-x-auto">
          <Link 
            href="/locations" 
            className={`px-6 py-3 text-center text-sm font-medium ${
              activeTab === 'cities' 
                ? 'text-red-600 border-b-2 border-red-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Города
          </Link>
          <Link 
            href="/locations/locations" 
            className={`px-6 py-3 text-center text-sm font-medium ${
              activeTab === 'locations' 
                ? 'text-red-600 border-b-2 border-red-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Локации
          </Link>
          <Link 
            href="/locations/containers" 
            className={`px-6 py-3 text-center text-sm font-medium ${
              activeTab === 'containers' 
                ? 'text-red-600 border-b-2 border-red-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Контейнеры
          </Link>
          <Link 
            href="/locations/cells" 
            className={`px-6 py-3 text-center text-sm font-medium ${
              activeTab === 'cells' 
                ? 'text-red-600 border-b-2 border-red-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Ячейки
          </Link>
        </div>
      </div>

      {/* Панель поиска и добавления */}
      <div className="flex justify-between mb-6">
        <div className="w-64">
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          onClick={onAddItem}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          + {activeTab === 'cities' ? 'Добавить город' : 
             activeTab === 'locations' ? 'Добавить локацию' : 
             activeTab === 'containers' ? 'Добавить контейнер' : 'Добавить ячейку'}
        </button>
      </div>

      {/* Содержимое */}
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}; 