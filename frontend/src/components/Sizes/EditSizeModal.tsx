import React, { useState, useEffect } from 'react';
import { useUpdateSizeMutation } from '@/services/sizesApi';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type Size = {
  id: string;
  name: string;
  size: string;
  area: string;
};

type EditSizeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  size: Size | null;
};

export const EditSizeModal: React.FC<EditSizeModalProps> = ({ isOpen, onClose, size }) => {
  const [updateSize, { isLoading }] = useUpdateSizeMutation();
  const [formData, setFormData] = useState<Omit<Size, 'id'>>({
    name: '',
    size: '',
    area: '',
  });

  useEffect(() => {
    if (size) {
      setFormData({
        name: size.name,
        size: size.size,
        area: size.area,
      });
    }
  }, [size]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!size || !formData.name || !formData.size || !formData.area) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await updateSize({
        id: size.id,
        ...formData
      }).unwrap();
      toast.success('Размер успешно обновлен');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении размера');
      console.error('Failed to update size:', error);
    }
  };

  if (!size) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать размер</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Размер
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
              Площадь
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 