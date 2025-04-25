'use client';

import React, { useState } from 'react';
import { Location, useDeleteLocationMutation } from '@/services/locationsApi';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useGetCitiesQuery } from '@/services/citiesApi';
import EditLocationModal from '@/components/modals/EditLocationModal';

interface LocationTableProps {
  locations: Location[];
  searchQuery?: string;
}

export const LocationTable: React.FC<LocationTableProps> = ({ locations, searchQuery = '' }) => {
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteLocation] = useDeleteLocationMutation();
  const { data: cities } = useGetCitiesQuery();

  // Фильтрация локаций по поисковому запросу
  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    location.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Функция для получения названия города по ID
  const getCityName = (location: Location) => {
    // Если у локации есть вложенный объект city, используем его
    if (location.city) {
      return location.city.title;
    }
    
    // Иначе ищем город по ID
    const city = cities?.find(city => city.id === location.cityId);
    return city ? city.title : 'Не указан';
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
  };

  const handleCloseModal = () => {
    setEditingLocation(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту локацию?')) {
      try {
        await deleteLocation(id).unwrap();
        toast.success('Локация удалена');
      } catch (error) {
        toast.error('Ошибка при удалении локации');
        console.error('Ошибка при удалении локации:', error);
      }
    }
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
              Адрес
            </th>
            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Город
            </th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredLocations.map(location => (
            <tr
              key={location.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                {`${location.name} (${location.short_name})`}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {location.address}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {getCityName(location)}
              </td>
              <td className="py-4 px-6 text-sm text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(location)}
                    className="h-8 w-8 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(location.id)}
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
      {filteredLocations.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Нет данных для отображения
        </div>
      )}

      {editingLocation && (
        <EditLocationModal 
          isOpen={!!editingLocation} 
          onClose={handleCloseModal} 
          location={editingLocation}
        />
      )}
    </div>
  );
}; 