'use client';

import React, { useState } from 'react';
import { 
  useGetCellStatusesQuery,
  useDeleteCellStatusMutation,
  CellStatus
} from '@/services/cellStatusesApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { CellStatusModal } from '@/components/modals/CellStatusModal';

export default function CellStatuses() {
  const { data: statuses, isLoading, isError, error } = useGetCellStatusesQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<CellStatus | null>(null);
  
  // Мутации для операций удаления
  const [deleteCellStatus] = useDeleteCellStatusMutation();

  // Фильтрация статусов по поисковому запросу
  const filteredStatuses = statuses ? statuses.filter(status => 
    status.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Обработчики для модального окна
  const handleOpenModal = (status?: CellStatus) => {
    setEditingStatus(status || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
  };

  // Обработчики действий для таблицы
  const handleEdit = (status: CellStatus) => {
    handleOpenModal(status);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот статус?')) {
      try {
        await deleteCellStatus(id).unwrap();
        toast.success('Статус удален');
      } catch (error) {
        toast.error('Ошибка при удалении статуса');
        console.error('Ошибка при удалении статуса:', error);
      }
    }
  };

  const handleDeleteAdapter = (status: CellStatus) => {
    handleDelete(status.id);
  };

  // Определение колонок для таблицы
  const columns: ColumnDef<CellStatus>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => {
        const status = row.original;
        return <div className="py-2 px-1">{status.name}</div>;
      },
    },
    {
      accessorKey: 'color',
      header: 'Цвет',
      cell: ({ row }) => {
        const status = row.original;
        return (
          <div className="py-2 px-1 flex items-center">
            <div 
              className="w-6 h-6 rounded-full mr-2" 
              style={{ backgroundColor: status.color }}
            />
            <span>{status.color}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Активен',
      cell: ({ row }) => {
        const status = row.original;
        return (
          <div className="py-2 px-1">
            {status.isActive ? 
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Да</span> : 
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Нет</span>
            }
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Статусы ячеек</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Добавить статус
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Поиск статусов..."
            className="pl-10 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 dark:border-blue-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Загрузка статусов...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">
            Ошибка при загрузке данных: {(error as any)?.data?.message || 'Неизвестная ошибка'}
          </p>
        </div>
      ) : statuses && statuses.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <BaseTable
            data={filteredStatuses}
            columns={columns}
            pageSize={10}
            enableColumnReordering={true}
            persistColumnOrder={true}
            tableId="cell-statuses-table"
            enableActions={true}
            onEdit={handleEdit}
            onDelete={handleDeleteAdapter}
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
          <p className="text-lg text-gray-600 dark:text-gray-300">Нет доступных статусов</p>
          <Button onClick={() => handleOpenModal()} className="mt-4">
            Добавить первый статус
          </Button>
        </div>
      )}

      {/* Модальное окно для создания/редактирования статуса */}
      <CellStatusModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        status={editingStatus}
        title={editingStatus ? 'Редактировать статус' : 'Добавить новый статус'}
      />
    </div>
  );
} 