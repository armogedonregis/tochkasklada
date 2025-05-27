'use client';

import { useState } from 'react';

interface FormModalState<T, R = any> {
  isOpen: boolean;
  editItem: R | null;
  formData?: T;
  isLoading: boolean;
}

interface FormModalOptions<T, R = any> {
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onClose?: () => void;
  initialState?: Partial<FormModalState<T, R>>;
  // Функция для преобразования редактируемого объекта в формат формы
  itemToFormData?: (item: R) => Partial<T>;
}

export function useFormModal<T, R = any>(options: FormModalOptions<T, R>) {
  const [state, setState] = useState<FormModalState<T, R>>({
    isOpen: false,
    editItem: null,
    formData: undefined,
    isLoading: false,
    ...(options.initialState || {})
  });

  // Открыть модальное окно для создания
  const openCreate = (initialData?: Partial<T>) => {
    setState({
      isOpen: true,
      editItem: null,
      formData: initialData as T,
      isLoading: false
    });
  };

  // Открыть модальное окно для редактирования
  const openEdit = async (item: R, initialData?: Partial<T>) => {
    // Если есть функция преобразования и нет явно переданных initialData,
    // используем её для преобразования объекта в формат формы
    const formValues = !initialData && options.itemToFormData 
      ? options.itemToFormData(item) 
      : initialData;
    
    setState({
      isOpen: true,
      editItem: item,
      formData: formValues as T,
      isLoading: false
    });
  };

  // Закрыть модальное окно
  const closeModal = () => {
    if (!state.isLoading) {
      setState({
        ...state,
        isOpen: false
      });
      
      if (options.onClose) {
        options.onClose();
      }
    }
  };

  // Сбросить все состояние
  const resetModal = () => {
    setState({
      isOpen: false,
      editItem: null,
      formData: undefined,
      isLoading: false
    });
  };

  // Установить состояние загрузки
  const setLoading = (loading: boolean) => {
    setState({
      ...state,
      isLoading: loading
    });
  };

  // Обработчик отправки формы
  const handleSubmit = async (values: T) => {
    console.log(values)
    setState({ ...state, isLoading: true });
    
    try {
      await options.onSubmit(values);
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      // Закрываем модальное окно при успешном сохранении
      resetModal();
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      setState({ ...state, isLoading: false });
    }
  };

  return {
    isOpen: state.isOpen,
    editItem: state.editItem,
    formData: state.formData,
    isLoading: state.isLoading,
    openCreate,
    openEdit,
    closeModal,
    resetModal,
    setLoading,
    handleSubmit
  };
}