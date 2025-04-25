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
import { Location, useUpdateLocationMutation } from '@/services/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesApi';

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location;
}

export default function EditLocationModal({ isOpen, onClose, location }: EditLocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    address: '',
    cityId: ''
  });
  
  const [updateLocation, { isLoading }] = useUpdateLocationMutation();
  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name,
        short_name: location.short_name,
        address: location.address,
        cityId: location.cityId
      });
    }
  }, [location]);

  // Функция для получения названия города по ID
  const getCityName = (cityId: string) => {
    if (location.city && location.city.id === cityId) {
      return location.city.title;
    }
    const city = cities?.find(city => city.id === cityId);
    return city ? city.title : 'Не указан';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (value: string) => {
    setFormData(prev => ({ ...prev, cityId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateLocation({
        id: location.id,
        name: formData.name,
        short_name: formData.short_name,
        address: formData.address,
        cityId: formData.cityId
      }).unwrap();
      
      toast.success('Локация успешно обновлена');
      onClose();
    } catch (error) {
      toast.error('Ошибка при обновлении локации');
      console.error('Ошибка при обновлении локации:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование локации</DialogTitle>
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
              <Label htmlFor="short_name" className="text-right">
                Сокр. название
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Адрес
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityId" className="text-right">
                Город
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.cityId}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      formData.cityId 
                        ? getCityName(formData.cityId) 
                        : "Выберите город"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {isCitiesLoading ? (
                      <SelectItem value="loading">
                        Загрузка...
                      </SelectItem>
                    ) : cities && cities.length > 0 ? (
                      cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty">
                        Нет доступных городов
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