'use client';

import React, { useState } from 'react';
import { 
  useGetSizesQuery, 
  useDeleteSizeMutation,
  Size
} from '@/services/sizesApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { SizeModal } from '@/components/modals/SizeModal';

export default function Sizes() {
  const { data: sizes, isLoading, isError, error } = useGetSizesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  
  // Мутации для операций удаления
  const [deleteSize] = useDeleteSizeMutation();
  
  // Фильтрация размеров по поисковому запросу
  const filteredSizes = sizes ? sizes.filter(size => 
    size.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    size.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.area.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Обработчики для модального окна
  const handleOpenModal = (size?: Size) => {
    setEditingSize(size || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSize(null);
  };

  // Обработчики действий для таблицы
  const handleEdit = (size: Size) => {
    handleOpenModal(size);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот размер?')) {
      try {
        await deleteSize(id).unwrap();
        toast.success('Размер удален');
      } catch (error) {
        toast.error('Ошибка при удалении размера');
        console.error('Ошибка при удалении размера:', error);
      }
    }
  };

  const handleDeleteAdapter = (size: Size) => {
    handleDelete(size.id);
  };

  // Определение колонок для таблицы
  const columns: ColumnDef<Size>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => {
        return <div className="py-2 px-1">{row.original.name}</div>;
      },
    },
    {
      accessorKey: 'size',
      header: 'Размер',
      cell: ({ row }) => {
        return <div className="py-2 px-1">{row.original.size}</div>;
      },
    },
    {
      accessorKey: 'area',
      header: 'Площадь',
      cell: ({ row }) => {
        return <div className="py-2 px-1">{row.original.area}</div>;
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Размеры ячеек</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
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
          <BaseTable
            data={filteredSizes}
            columns={columns}
            pageSize={10}
            enableColumnReordering={true}
            persistColumnOrder={true}
            tableId="sizes-table"
            enableActions={true}
            onEdit={handleEdit}
            onDelete={handleDeleteAdapter}
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <p className="text-lg text-gray-600 dark:text-gray-300">Нет доступных размеров</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            Добавить первый размер
          </Button>
        </div>
      )}

      {/* Модальное окно для создания/редактирования размера */}
      <SizeModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        size={editingSize}
        title={editingSize ? 'Редактировать размер' : 'Добавить новый размер'}
      />
    </div>
  );
} 