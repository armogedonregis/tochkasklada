'use client';

import React, { useState } from 'react';
import { City, useDeleteCityMutation } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import EditCityModal from '@/components/modals/EditCityModal';

interface CityTableProps {
  cities: City[];
  searchQuery?: string;
}

export const CityTable: React.FC<CityTableProps> = ({ cities, searchQuery = '' }) => {
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [deleteCity] = useDeleteCityMutation();

  // Фильтрация городов по поисковому запросу
  const filteredCities = cities.filter(city => 
    city.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    city.short_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (city: City) => {
    setEditingCity(city);
  };

  const handleCloseModal = () => {
    setEditingCity(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот город?')) {
      try {
        await deleteCity(id).unwrap();
        toast.success('Город удален');
      } catch (error) {
        toast.error('Ошибка при удалении города');
        console.error('Ошибка при удалении города:', error);
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
              Короткое имя
            </th>
            <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredCities.map(city => (
            <tr
              key={city.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                {city.title}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-300">
                {city.short_name}
              </td>
              <td className="py-4 px-6 text-sm text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEdit(city)}
                    className="h-8 w-8 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(city.id)}
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
      {filteredCities.length === 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Нет данных для отображения
        </div>
      )}

      {editingCity && (
        <EditCityModal 
          isOpen={!!editingCity} 
          onClose={handleCloseModal} 
          city={editingCity}
        />
      )}
    </div>
  );
}; 