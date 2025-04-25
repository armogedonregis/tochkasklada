'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LocationsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Локации</h1>
      </div>

      {/* Навигационные вкладки */}
      <div className="flex border-b mb-4">
        <Link href="/locations">
          <span 
            className={`px-4 py-2 cursor-pointer ${
              isActive('/locations') && !isActive('/locations/locations') && !isActive('/locations/containers') && !isActive('/locations/cells') 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : ''
            }`}
          >
            Города
          </span>
        </Link>
        <Link href="/locations/locations">
          <span 
            className={`px-4 py-2 cursor-pointer ${
              isActive('/locations/locations') ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
          >
            Локации
          </span>
        </Link>
        <Link href="/locations/containers">
          <span 
            className={`px-4 py-2 cursor-pointer ${
              isActive('/locations/containers') ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
          >
            Контейнеры
          </span>
        </Link>
        <Link href="/locations/cells">
          <span 
            className={`px-4 py-2 cursor-pointer ${
              isActive('/locations/cells') ? 'border-b-2 border-blue-500 text-blue-500' : ''
            }`}
          >
            Ячейки
          </span>
        </Link>
      </div>

      {/* Основное содержимое */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        {children}
      </div>
    </div>
  );
} 