'use client';

import React, { useState } from 'react';
import { Size, useUpdateSizeMutation, useDeleteSizeMutation, UpdateSizeDto } from '@/services/sizesApi';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';

interface SizeTableProps {
  sizes: Size[];
  searchQuery?: string;
}

export const SizeTable: React.FC<SizeTableProps> = ({ sizes, searchQuery = '' }) => {
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<UpdateSizeDto>({});
  
  const [updateSize] = useUpdateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();

  // Фильтрация размеров по поисковому запросу
  const filteredSizes = sizes.filter(size => 
    size.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    size.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    size.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (size: Size) => {
    setEditingSize(size.id);
    setEditValues({
      name: size.name,
      size: size.size,
      area: size.area
    });
  };

  const handleCancelEdit = () => {
    setEditingSize(null);
    setEditValues({});
  };

  const handleSaveEdit = async (size: Size) => {
    try {
      // Проверка, что хотя бы одно поле заполнено
      if (!editValues.name && !editValues.size && !editValues.area) {
        toast.error('Необходимо изменить хотя бы одно поле');
        return;
      }
      
      // Собираем только измененные поля
      const updatedFields: UpdateSizeDto = {};
      if (editValues.name !== undefined) updatedFields.name = editValues.name;
      if (editValues.size !== undefined) updatedFields.size = editValues.size;
      if (editValues.area !== undefined) updatedFields.area = editValues.area;
      
      await updateSize({
        id: size.id,
        ...updatedFields
      }).unwrap();
      
      toast.success('Размер обновлен');
      setEditingSize(null);
      setEditValues({});
    } catch (error) {
      toast.error('Ошибка при обновлении размера');
      console.error('Ошибка при обновлении размера:', error);
    }
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

  const handleInputChange = (field: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Определение колонок для BaseTable
  const columns: ColumnDef<Size>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => {
        const size = row.original;
        return editingSize === size.id ? (
          <Input 
            value={editValues.name || ''} 
            onChange={(e) => handleInputChange('name', e.target.value)} 
            className="py-1 px-2 w-full"
          />
        ) : (
          <div className="py-2 px-1">{size.name}</div>
        );
      },
    },
    {
      accessorKey: 'size',
      header: 'Размер',
      cell: ({ row }) => {
        const size = row.original;
        return editingSize === size.id ? (
          <Input 
            value={editValues.size || ''} 
            onChange={(e) => handleInputChange('size', e.target.value)} 
            className="py-1 px-2 w-full"
          />
        ) : (
          <div className="py-2 px-1">{size.size}</div>
        );
      },
    },
    {
      accessorKey: 'area',
      header: 'Площадь',
      cell: ({ row }) => {
        const size = row.original;
        return editingSize === size.id ? (
          <Input 
            value={editValues.area || ''} 
            onChange={(e) => handleInputChange('area', e.target.value)} 
            className="py-1 px-2 w-full"
          />
        ) : (
          <div className="py-2 px-1">{size.area}</div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => {
        const size = row.original;
        return (
          <div className={`flex justify-end space-x-2 ${editingSize === size.id ? 'pr-6' : ''}`}>
            {editingSize === size.id ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleSaveEdit(size)}
                  className="h-8 w-8 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                >
                  <Check size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCancelEdit}
                  className="h-8 w-8 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                >
                  <X size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEdit(size)}
                  className="h-8 w-8 text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(size.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <BaseTable
      data={filteredSizes}
      columns={columns}
      pageSize={10}
      enableColumnReordering={true}
      persistColumnOrder={true}
      tableId="sizes-table"
    />
  );
}; 