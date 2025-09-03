'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getNavigationIcon } from './icons';

interface MenuItemProps {
  iconKey: string;
  pageName: string;
  newItems?: number;
  isNavOpened?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  iconKey,
  pageName,
  newItems = 0,
  isNavOpened = true,
  href,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href;
  
  const handleMouseEnter = () => {
    // Отключаем hover на тач-устройствах
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || (window.matchMedia && window.matchMedia('(hover: none)').matches));
    if (isTouch) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
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

  const RenderLink = (props: any) => {
    if (href && href !== '') {
      return <Link href={href} {...props}></Link>
    }
    return <div {...props}></div>
  }

  return (
    <RenderLink
      className={`w-full h-11 block cursor-pointer select-none transition-all duration-200 ease-in-out px-4 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        } ${isPressed ? 'bg-gray-200 dark:bg-gray-700' : ''
        } rounded-2xl active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onClick={onClick}
    >
      <div className="flex items-center h-full px-2">
        <div className="flex items-center justify-center w-7 h-7">
          {getNavigationIcon(iconKey, isHovered || isActive, `h-5 w-5 ${isHovered || isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`)}
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
    </RenderLink>
  );
}; 