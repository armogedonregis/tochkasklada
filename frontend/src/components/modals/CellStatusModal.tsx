'use client';

import React, { useState, useEffect } from 'react';
import { 
  useAddCellStatusMutation, 
  useUpdateCellStatusMutation,
  CreateCellStatusDto, 
  UpdateCellStatusDto,
  CellStatus
} from '@/services/cellStatusesApi';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

type CellStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  status?: CellStatus | null;
  title?: string;
};

export const CellStatusModal: React.FC<CellStatusModalProps> = ({ 
  isOpen, 
  onClose, 
  status = null,
  title = 'Добавить новый статус ячейки'
}) => {
  const [addCellStatus, { isLoading: isAddLoading }] = useAddCellStatusMutation();
  const [updateCellStatus, { isLoading: isUpdateLoading }] = useUpdateCellStatusMutation();
  
  const isLoading = isAddLoading || isUpdateLoading;
  const isEditing = !!status;
  
  const [formData, setFormData] = useState<CreateCellStatusDto>({
    name: '',
    color: '#4f46e5', // Начальный цвет (синий)
    isActive: true
  });

  // Заполняем форму данными статуса при редактировании
  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name,
        color: status.color,
        isActive: status.isActive
      });
    } else {
      // Сбрасываем форму при создании нового статуса
      setFormData({
        name: '',
        color: '#4f46e5',
        isActive: true
      });
    }
  }, [status, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.color) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Проверка формата цвета
    const colorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    if (!colorRegex.test(formData.color)) {
      toast.error('Пожалуйста, введите корректный цвет в формате #RRGGBB');
      return;
    }

    try {
      if (isEditing && status) {
        // Обновляем существующий статус
        await updateCellStatus({
          id: status.id,
          ...formData
        }).unwrap();
        toast.success('Статус успешно обновлен');
      } else {
        // Добавляем новый статус
        await addCellStatus(formData).unwrap();
        toast.success('Статус успешно добавлен');
      }
      
      onClose();
      // Сбрасываем форму
      setFormData({ name: '', color: '#4f46e5', isActive: true });
    } catch (error) {
      toast.error(`Ошибка при ${isEditing ? 'обновлении' : 'добавлении'} статуса`);
      console.error(`Failed to ${isEditing ? 'update' : 'add'} status:`, error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Если модальное окно пытаются закрыть кликом за пределами (open становится false),
      // то предотвращаем закрытие, не вызывая onClose
      if (!open) {
        // Здесь мы ничего не делаем, чтобы предотвратить закрытие
      }
    }}>
      <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="relative">
          <DialogTitle>{status ? 'Редактировать статус' : 'Добавить новый статус'}</DialogTitle>
          <button 
            onClick={onClose} 
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            type="button"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название статуса</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Например: Занято, Свободно, Ремонт"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Цвет статуса</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="color-picker"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-9 p-1"
              />
              <Input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="#RRGGBB"
                className="flex-1"
                pattern="^#([0-9A-Fa-f]{3}){1,2}$"
                title="Цвет в формате HEX: #RGB или #RRGGBB"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="isActive" 
              name="isActive"
              checked={formData.isActive === true}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isActive: checked === true }))
              }
            />
            <Label 
              htmlFor="isActive" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Активный статус
            </Label>
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