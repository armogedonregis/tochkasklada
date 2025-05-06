'use client';

import React, { useState, useEffect } from 'react';
import { 
  useAddSizeMutation, 
  useUpdateSizeMutation,
  CreateSizeDto, 
  Size
} from '@/services/sizesApi';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type SizeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  size?: Size | null;
  title?: string;
};

export const SizeModal: React.FC<SizeModalProps> = ({ 
  isOpen, 
  onClose, 
  size = null,
  title = 'Добавить новый размер'
}) => {
  const [addSize, { isLoading: isAddLoading }] = useAddSizeMutation();
  const [updateSize, { isLoading: isUpdateLoading }] = useUpdateSizeMutation();
  
  const isLoading = isAddLoading || isUpdateLoading;
  const isEditing = !!size;
  
  const [formData, setFormData] = useState<CreateSizeDto>({
    name: '',
    size: '',
    area: '',
  });

  // Заполняем форму данными размера при редактировании
  useEffect(() => {
    if (size) {
      setFormData({
        name: size.name,
        size: size.size,
        area: size.area
      });
    } else {
      // Сбрасываем форму при создании нового размера
      setFormData({
        name: '',
        size: '',
        area: '',
      });
    }
  }, [size, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.size || !formData.area) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      if (isEditing && size) {
        // Обновляем существующий размер
        await updateSize({
          id: size.id,
          ...formData
        }).unwrap();
        toast.success('Размер успешно обновлен');
      } else {
        // Добавляем новый размер
        await addSize(formData).unwrap();
        toast.success('Размер успешно добавлен');
      }
      
      onClose();
      // Сбрасываем форму
      setFormData({ name: '', size: '', area: '' });
    } catch (error) {
      toast.error(`Ошибка при ${isEditing ? 'обновлении' : 'добавлении'} размера`);
      console.error(`Failed to ${isEditing ? 'update' : 'add'} size:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: Маленький, Средний, Большой"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">Размер</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Например: 1x1, 2x2, 3x3"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Площадь</Label>
            <Input
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Например: 1, 4, 9"
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 