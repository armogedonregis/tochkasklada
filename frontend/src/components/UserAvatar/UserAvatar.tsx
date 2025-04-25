'use client';

import { useState } from 'react';

interface UserAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  showBorder?: boolean;
  onClick?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  name = 'U',
  size = 'md',
  showBorder = true,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Определяем размеры в зависимости от переданного параметра
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  // Получаем инициалы из имени
  const getInitials = () => {
    if (!name) return 'U';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };
  
  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden
        ${showBorder ? 'ring-2 ring-white dark:ring-gray-800' : ''}
        ${isHovered ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}
        transition-all duration-200 ease-in-out
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name || 'User avatar'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-blue-500 text-white font-medium">
          {getInitials()}
        </div>
      )}
    </div>
  );
}; 