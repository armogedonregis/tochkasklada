'use client';

import React, { useState } from 'react';
import { Container, useDeleteContainerMutation } from '@/services/containersApi';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetLocationsQuery } from '@/services/locationsApi';
import EditContainerModal from '@/components/modals/EditContainerModal';

interface ContainerTableProps {
  containers: Container[];
  searchQuery?: string;
}

export const ContainerTable: React.FC<ContainerTableProps> = ({ containers, searchQuery = '' }) => {
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [deleteContainer] = useDeleteContainerMutation();
  const { data: locations } = useGetLocationsQuery();

  // Фильтрация контейнеров по поисковому запросу
  const filteredContainers = containers.filter(container => 
    container.id.toString().includes(searchQuery) || 
    container.locId.includes(searchQuery) ||
    getLocationName(container.locId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Функция для получения названия локации по ID
  const getLocationName = (locId: string) => {
    const location = locations?.find(loc => loc.id === locId);
    return location ? location.name : 'Не указана';
  };

  const handleEdit = (container: Container) => {
    setEditingContainer(container);
  };

  const handleCloseModal = () => {
    setEditingContainer(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот контейнер?')) {
      try {
        await deleteContainer(id).unwrap();
        toast.success('Контейнер удален');
      } catch (error) {
        toast.error('Ошибка при удалении контейнера');
        console.error('Ошибка при удалении контейнера:', error);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Номер контейнера
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Локация
            </th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredContainers.map(container => (
            <tr
              key={container.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                {container.id}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {getLocationName(container.locId)}
              </td>
              <td className="py-4 px-6 text-sm text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(container)}
                    className="h-8 w-8 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(container.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredContainers.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Нет данных для отображения
        </div>
      )}

      {editingContainer && (
        <EditContainerModal 
          isOpen={!!editingContainer} 
          onClose={handleCloseModal} 
          container={editingContainer}
        />
      )}
    </div>
  );
}; 