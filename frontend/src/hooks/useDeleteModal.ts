'use client';

import { useState } from 'react';

interface DeleteModalState {
  isOpen: boolean;
  entityId: string | null;
  entityName: string | null;
  isLoading: boolean;
}

export function useDeleteModal() {
  const [state, setState] = useState<DeleteModalState>({
    isOpen: false,
    entityId: null,
    entityName: null,
    isLoading: false
  });

  // Открыть модальное окно удаления
  const openDelete = (entityId: string, entityName?: string) => {
    setState({
      isOpen: true,
      entityId,
      entityName: entityName || null,
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
    }
  };

  // Сбросить все состояние (например, после закрытия)
  const resetModal = () => {
    setState({
      isOpen: false,
      entityId: null,
      entityName: null,
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

  return {
    isOpen: state.isOpen,
    entityId: state.entityId,
    entityName: state.entityName,
    isLoading: state.isLoading,
    openDelete,
    closeModal,
    resetModal,
    setLoading
  };
} 