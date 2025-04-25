'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { City, useUpdateCityMutation } from '@/services/citiesApi';

interface EditCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: City;
}

export default function EditCityModal({ isOpen, onClose, city }: EditCityModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    short_name: ''
  });
  
  const [updateCity, { isLoading }] = useUpdateCityMutation();

  useEffect(() => {
    if (city) {
      setFormData({
        title: city.title,
        short_name: city.short_name
      });
    }
  }, [city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateCity({
        id: city.id,
        title: formData.title,
        short_name: formData.short_name
      }).unwrap();
      
      toast.success('Город успешно обновлен');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении города');
      console.error('Ошибка при обновлении города:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование города</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Название
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="short_name" className="text-right">
                Короткое имя
              </Label>
              <Input
                id="short_name"
                name="short_name"
                value={formData.short_name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
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