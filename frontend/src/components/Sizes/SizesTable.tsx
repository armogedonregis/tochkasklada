import React, { useState } from 'react';
import { Size, useDeleteSizeMutation, useGetSizesQuery } from '@/services/sizesApi';
import { toast } from 'react-toastify';
import { EditSizeModal } from './EditSizeModal';

export const SizesTable: React.FC = () => {
  const { data: sizes, isLoading, isError, error } = useGetSizesQuery();
  const [deleteSize] = useDeleteSizeMutation();
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот размер?')) {
      try {
        await deleteSize(id).unwrap();
        toast.success('Размер успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении размера');
        console.error('Failed to delete size:', error);
      }
    }
  };

  const handleEdit = (size: Size) => {
    setEditingSize(size);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center p-4">Загрузка...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Ошибка при загрузке данных: {(error as any)?.data?.message || 'Неизвестная ошибка'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {sizes && sizes.length > 0 ? (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Название</th>
              <th scope="col" className="px-6 py-3">Размер</th>
              <th scope="col" className="px-6 py-3">Площадь</th>
              <th scope="col" className="px-6 py-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((size) => (
              <tr key={size.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{size.name}</td>
                <td className="px-6 py-4">{size.size}</td>
                <td className="px-6 py-4">{size.area}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(size)}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(size.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center p-4">Нет доступных размеров</div>
      )}

      {editingSize && (
        <EditSizeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingSize(null);
          }}
          size={editingSize}
        />
      )}
    </div>
  );
}; 