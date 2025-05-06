'use client';

import React, { useState } from 'react';
import { 
  CellStatus, 
  useDeleteCellStatusMutation 
} from '@/services/cellStatusesApi';
import { toast } from 'react-toastify';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { TableActions } from '@/components/table/TableActions';
import { CellStatusModal } from './CellStatusModal';

interface CellStatusTableProps {
  statuses: CellStatus[];
  searchQuery?: string;
}

export const CellStatusTable: React.FC<CellStatusTableProps> = ({ 
  statuses, 
  searchQuery = '' 
}) => {
  const [editingStatus, setEditingStatus] = useState<CellStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCellStatus] = useDeleteCellStatusMutation();

  // Фильтрация статусов по поисковому запросу
  const filteredStatuses = statuses.filter(status => 
    status.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (status: CellStatus) => {
    setEditingStatus(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStatus(null);
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

  // Определение колонок для BaseTable
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
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const status = row.original;
        return (
          <TableActions 
            onEdit={() => handleEdit(status)}
            onDelete={() => handleDelete(status.id)}
          />
        );
      },
    },
  ];

  return (
    <>
      <BaseTable
        data={filteredStatuses}
        columns={columns}
        pageSize={10}
        enableColumnReordering={true}
        persistColumnOrder={true}
        tableId="cell-statuses-table"
      />
      
      <CellStatusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        status={editingStatus}
        title={editingStatus ? 'Редактировать статус' : 'Добавить новый статус'}
      />
    </>
  );
}; 