'use client';

import React, { useState } from 'react';
import { CreateSizeModal } from '@/components/Sizes/CreateSizeModal';
import { useGetSizesQuery } from '@/services/sizesApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { SizeTable } from '@/components/Sizes/SizeTable';

export default function Sizes() {
  const { data: sizes, isLoading, isError, error } = useGetSizesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Размеры ячеек</h1>
        <Button onClick={handleOpenModal} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить размер
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Поиск размеров..."
            className="pl-10 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Загрузка размеров...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">
            Ошибка при загрузке данных: {(error as any)?.data?.message || 'Неизвестная ошибка'}
          </p>
        </div>
      ) : sizes && sizes.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <SizeTable sizes={sizes} searchQuery={searchQuery} />
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <p className="text-lg text-gray-600 dark:text-gray-300">Нет доступных размеров</p>
          <Button onClick={handleOpenModal} className="mt-4">
            Добавить первый размер
          </Button>
        </div>
      )}

      <CreateSizeModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
} 