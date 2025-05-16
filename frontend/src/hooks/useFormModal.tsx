import { useState, useCallback } from 'react';

interface UseFormModalOptions<T> {
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Хук для управления модальными окнами с формами
 */
export function useFormModal<T, EditItemType = T>({
  onSubmit,
  onSuccess,
  onError,
}: UseFormModalOptions<T>) {
  // Состояние для открытия/закрытия модального окна
  const [isOpen, setIsOpen] = useState(false);
  
  // Состояние для редактируемого элемента
  const [editItem, setEditItem] = useState<EditItemType | null>(null);
  
  // Состояние загрузки
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Открытие модального окна для создания
  const openCreate = useCallback(() => {
    setEditItem(null);
    setIsOpen(true);
  }, []);
  
  // Открытие модального окна для редактирования
  const openEdit = useCallback((item: EditItemType) => {
    setEditItem(item);
    setIsOpen(true);
  }, []);
  
  // Закрытие модального окна
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Сбрасываем редактируемый элемент после задержки,
    // чтобы анимация закрытия успела завершиться
    setTimeout(() => {
      setEditItem(null);
    }, 200);
  }, []);
  
  // Обработчик отправки формы
  const handleSubmit = useCallback(async (values: T) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit(values);
      closeModal();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, closeModal, onSuccess, onError]);
  
  return {
    isOpen,
    editItem,
    isSubmitting,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,
  };
} 