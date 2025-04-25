'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Container, useUpdateContainerMutation } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';

interface EditContainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: Container;
}

export default function EditContainerModal({ isOpen, onClose, container }: EditContainerModalProps) {
  const [formData, setFormData] = useState({
    locId: ''
  });
  
  const [updateContainer, { isLoading }] = useUpdateContainerMutation();
  const { data: locations, isLoading: isLocationsLoading } = useGetLocationsQuery();

  useEffect(() => {
    if (container) {
      setFormData({
        locId: container.locId,
      });
    }
  }, [container]);

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, locId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateContainer({
        id: container.id,
        locId: formData.locId
      }).unwrap();
      
      toast.success('Контейнер успешно обновлен');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении контейнера');
      console.error('Ошибка при обновлении контейнера:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование контейнера №{container.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locId" className="text-right">
                Локация
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.locId}
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите локацию" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {isLocationsLoading ? (
                      <SelectItem value="loading">
                        Загрузка...
                      </SelectItem>
                    ) : locations && locations.length > 0 ? (
                      locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty">
                        Нет доступных локаций
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