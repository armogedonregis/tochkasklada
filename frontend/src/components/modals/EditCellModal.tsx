'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Cell, useUpdateCellMutation } from '@/services/cellsApi';
import { useGetContainersQuery } from '@/services/containersApi';
import { useGetSizesQuery } from '@/services/sizesApi';

interface EditCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  cell: Cell;
}

export default function EditCellModal({ isOpen, onClose, cell }: EditCellModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    containerId: 0,
    size_id: '',
    len_height: ''
  });
  
  const [updateCell, { isLoading }] = useUpdateCellMutation();
  const { data: containers, isLoading: isContainersLoading } = useGetContainersQuery();
  const { data: sizes, isLoading: isSizesLoading } = useGetSizesQuery();

  useEffect(() => {
    if (cell) {
      setFormData({
        name: cell.name,
        containerId: cell.containerId,
        size_id: cell.size_id,
        len_height: cell.len_height || ''
      });
    }
  }, [cell]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContainerChange = (value: string) => {
    setFormData(prev => ({ ...prev, containerId: Number(value) }));
  };

  const handleSizeChange = (value: string) => {
    setFormData(prev => ({ ...prev, size_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCell({
        id: cell.id,
        name: formData.name,
        containerId: formData.containerId,
        size_id: formData.size_id,
        len_height: formData.len_height
      }).unwrap();
      
      toast.success('Ячейка успешно обновлена');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении ячейки');
      console.error('Ошибка при обновлении ячейки:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактирование ячейки {cell.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="len_height" className="text-right">
                Размеры
              </Label>
              <Input
                id="len_height"
                name="len_height"
                value={formData.len_height}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Например: 500x600"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size_id" className="text-right">
                Тип размера
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.size_id}
                  onValueChange={handleSizeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип размера" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {isSizesLoading ? (
                      <SelectItem value="loading">
                        Загрузка...
                      </SelectItem>
                    ) : sizes && sizes.length > 0 ? (
                      sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty">
                        Нет доступных типов размеров
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="containerId" className="text-right">
                Контейнер
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.containerId.toString()}
                  onValueChange={handleContainerChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите контейнер" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {isContainersLoading ? (
                      <SelectItem value="loading">
                        Загрузка...
                      </SelectItem>
                    ) : containers && containers.length > 0 ? (
                      containers.map((container) => (
                        <SelectItem key={container.id} value={container.id.toString()}>
                          Контейнер №{container.id}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty">
                        Нет доступных контейнеров
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
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
} 