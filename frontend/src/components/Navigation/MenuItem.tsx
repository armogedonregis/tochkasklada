'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isActive = pathname === href;

  const RenderLink = (props: any) => {
    if (href && href !== '') {
      return <Link href={href} {...props}></Link>
    }
    return <div {...props}></div>
  }

  return (
    <RenderLink
      className={`w-full h-11 block group cursor-pointer select-none transition-all duration-200 ease-in-out px-4 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        } rounded-2xl active:bg-gray-200 dark:active:bg-gray-700 touch-manipulation ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onClick={onClick}
    >
      <div className="flex items-center h-full px-2">
        <div className="flex items-center justify-center w-7 h-7">
          {getNavigationIcon(iconKey, isActive, `h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 group-hover:dark:text-blue-400'}`)}
        </div>

        {isNavOpened && (
          <div className="flex flex-grow items-center justify-between">
            <span
              className={`ml-4 text-sm font-medium transition-all duration-150 no-select group-hover:text-blue-600 group-hover:dark:text-blue-400 text-gray-900 dark:text-white`}
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