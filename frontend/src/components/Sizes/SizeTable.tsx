'use client';

import React, { useState } from 'react';
import { Size, useUpdateSizeMutation, useDeleteSizeMutation, UpdateSizeDto } from '@/services/sizesApi';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Название
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Размер
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Площадь
            </th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredSizes.map(size => (
            <tr
              key={size.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                {editingSize === size.id ? (
                  <Input 
                    value={editValues.name || ''} 
                    onChange={(e) => handleInputChange('name', e.target.value)} 
                    className="py-1 px-2 w-full"
                  />
                ) : (
                  size.name
                )}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {editingSize === size.id ? (
                  <Input 
                    value={editValues.size || ''} 
                    onChange={(e) => handleInputChange('size', e.target.value)} 
                    className="py-1 px-2 w-full"
                  />
                ) : (
                  size.size
                )}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {editingSize === size.id ? (
                  <Input 
                    value={editValues.area || ''} 
                    onChange={(e) => handleInputChange('area', e.target.value)} 
                    className="py-1 px-2 w-full"
                  />
                ) : (
                  size.area
                )}
              </td>
              <td className="py-4 px-6 text-sm text-right">
                {editingSize === size.id ? (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleSaveEdit(size)}
                      className="h-8 w-8 text-green-600 hover:text-green-800"
                    >
                      <Check size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCancelEdit}
                      className="h-8 w-8 text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(size)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(size.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredSizes.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}; 