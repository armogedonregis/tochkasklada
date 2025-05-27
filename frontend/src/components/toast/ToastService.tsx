'use client';

import { toast, ToastOptions, TypeOptions } from 'react-toastify';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import React from 'react';

// Базовые настройки для toast уведомлений
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: CustomCloseButton,
};

// Кастомная кнопка закрытия
function CustomCloseButton({ closeToast }: { closeToast: () => void }) {
  return (
    <button onClick={closeToast} className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
      <X className="w-4 h-4" />
    </button>
  );
}

// Компонент сообщения с иконкой
const ToastMessage = ({ 
  icon, 
  title, 
  message 
}: { 
  icon: React.ReactNode; 
  title?: string; 
  message: string 
}) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mr-3 mt-0.5">
      {icon}
    </div>
    <div className="flex-1">
      {title && <div className="font-medium">{title}</div>}
      <div className="text-sm">{message}</div>
    </div>
  </div>
);

// Объект с методами для разных типов уведомлений
export const ToastService = {
  /**
   * Уведомление об успешном действии
   */
  success: (message: string, title?: string, options?: ToastOptions) => {
    return toast.success(
      <ToastMessage 
        icon={<CheckCircle className="w-5 h-5 text-green-500" />} 
        title={title} 
        message={message} 
      />,
      { ...defaultOptions, ...options }
    );
  },

  /**
   * Уведомление об ошибке
   */
  error: (message: string, title?: string, options?: ToastOptions) => {
    return toast.error(
      <ToastMessage 
        icon={<AlertCircle className="w-5 h-5 text-red-500" />} 
        title={title} 
        message={message} 
      />,
      { ...defaultOptions, ...options }
    );
  },

  /**
   * Предупреждающее уведомление
   */
  warning: (message: string, title?: string, options?: ToastOptions) => {
    return toast.warning(
      <ToastMessage 
        icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} 
        title={title} 
        message={message} 
      />,
      { ...defaultOptions, ...options }
    );
  },

  /**
   * Информационное уведомление
   */
  info: (message: string, title?: string, options?: ToastOptions) => {
    return toast.info(
      <ToastMessage 
        icon={<Info className="w-5 h-5 text-blue-500" />} 
        title={title} 
        message={message} 
      />,
      { ...defaultOptions, ...options }
    );
  },

  /**
   * Обновление существующего уведомления
   */
  update: (toastId: string | number, options: { render: React.ReactNode; type?: TypeOptions; }) => {
    toast.update(toastId, options);
  },

  /**
   * Закрытие уведомления
   */
  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }
}; 