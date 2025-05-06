'use client';

import React, { useState } from 'react';
import { Size, useDeleteSizeMutation } from '@/services/sizesApi';
import { toast } from 'react-toastify';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { TableActions } from '@/components/table/TableActions';
import { SizeModal } from './SizeModal';

interface SizeTableProps {
  sizes: Size[];
  searchQuery?: string;
}

export const SizeTable: React.FC<SizeTableProps> = ({ sizes, searchQuery = '' }) => {
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSize] = useDeleteSizeMutation();

  // Фильтрация размеров по поисковому запросу
  const filteredSizes = sizes.filter(size => 
    size.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    size.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (size: Size) => {
    setEditingSize(size);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSize(null);
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

  // Определение колонок для BaseTable
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
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        return (
          <TableActions 
            onEdit={() => handleEdit(row.original)}
            onDelete={() => handleDelete(row.original.id)}
          />
        );
      },
    },
  ];

  return (
    <>
      <BaseTable
        data={filteredSizes}
        columns={columns}
        pageSize={10}
        enableColumnReordering={true}
        persistColumnOrder={true}
        tableId="sizes-table"
      />
      
      <SizeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size={editingSize}
        title={editingSize ? 'Редактировать размер' : 'Добавить новый размер'}
      />
    </>
  );
}; 