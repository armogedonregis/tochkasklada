'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Cell, useDeleteCellMutation } from '@/services/cellsApi';
import { Container } from '@/services/containersApi';
import { Location } from '@/services/locationsApi';
import { Size } from '@/services/sizesApi';
import { Pencil, Trash2 } from 'lucide-react';
import EditCellModal from '@/components/modals/EditCellModal';

interface CellTableProps {
  cells: Cell[];
  searchQuery: string;
  containers?: Container[];
  locations?: Location[];
  sizes?: Size[];
}

export const CellTable: React.FC<CellTableProps> = ({ 
  cells, 
  searchQuery,
  containers,
  locations,
  sizes
}) => {
  const [editingCell, setEditingCell] = useState<Cell | null>(null);
  const [deleteCell, { isLoading: isDeleting }] = useDeleteCellMutation();

  // Функция для фильтрации ячеек по поисковому запросу
  const filteredCells = cells.filter(cell => {
    if (!searchQuery || !searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const container = containers?.find(c => c.id === cell.containerId);
    const location = container ? locations?.find(l => l.id === container.locId) : undefined;
    const size = sizes?.find(s => s.id === cell.size_id);
    
    return (
      cell.name.toLowerCase().includes(searchLower) ||
      cell.len_height?.toLowerCase().includes(searchLower) ||
      size?.name.toLowerCase().includes(searchLower) ||
      container?.id.toString().includes(searchLower) ||
      location?.name.toLowerCase().includes(searchLower) ||
      location?.city?.title.toLowerCase().includes(searchLower)
    );
  });

  // Функция для получения данных контейнера
  const getContainerInfo = (containerId: number) => {
    return containers?.find(container => container.id === containerId);
  };

  // Функция для получения данных локации
  const getLocationInfo = (locId: string) => {
    return locations?.find(location => location.id === locId);
  };

  // Функция для получения данных размера
  const getSizeInfo = (sizeId: string) => {
    return sizes?.find(size => size.id === sizeId);
  };

  const handleEdit = (cell: Cell) => {
    setEditingCell(cell);
  };

  const handleCloseModal = () => {
    setEditingCell(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту ячейку?')) {
      try {
        await deleteCell(id).unwrap();
        toast.success('Ячейка успешно удалена');
      } catch (error) {
        console.error('Failed to delete cell:', error);
        toast.error('Ошибка при удалении ячейки');
      }
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">Ячейка</th>
            <th className="py-2 px-4 border-b text-left">Размеры</th>
            <th className="py-2 px-4 border-b text-left">Тип размера</th>
            <th className="py-2 px-4 border-b text-left">Контейнер</th>
            <th className="py-2 px-4 border-b text-left">Локация</th>
            <th className="py-2 px-4 border-b text-left">Город</th>
            <th className="py-2 px-4 border-b text-left">Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredCells.length > 0 ? (
            filteredCells.map(cell => {
              const container = getContainerInfo(cell.containerId);
              const location = container ? getLocationInfo(container.locId) : undefined;
              const size = getSizeInfo(cell.size_id);
              
              return (
                <tr key={cell.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {cell.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {cell.len_height}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {size?.name || 'Не указан'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    Контейнер №{cell.containerId}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {location?.name || 'Не указана'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {location?.city?.title || 'Не указан'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(cell)}
                      >
                        <Pencil size={16} className="mr-1" /> Изменить
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(cell.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 size={16} className="mr-1" /> Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                {cells.length === 0
                  ? 'Нет доступных ячеек.'
                  : 'Ничего не найдено. Попробуйте изменить запрос поиска.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingCell && (
        <EditCellModal 
          isOpen={!!editingCell} 
          onClose={handleCloseModal} 
          cell={editingCell}
        />
      )}
    </div>
  );
}; 