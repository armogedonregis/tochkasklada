'use client';

import React, { useEffect, useState } from 'react';
import { useAddLocationMutation } from '@/services/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesApi';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CreateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLocationModal: React.FC<CreateLocationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [address, setAddress] = useState('');
  const [cityId, setCityId] = useState('');
  const [nameError, setNameError] = useState('');
  const [shortNameError, setShortNameError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [cityError, setCityError] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { data: cities, isLoading: isCitiesLoading, error: citiesError } = useGetCitiesQuery();
  const [addLocation, { isLoading, isSuccess, error }] = useAddLocationMutation();

  // Логирование данных о городах для отладки
  useEffect(() => {
    if (cities) {
      console.log('Cities data:', cities);
    }
  }, [cities]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Локация успешно создана');
      resetForm();
      onClose();
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (error) {
      toast.error('Ошибка при создании локации');
    }
  }, [error]);

  const resetForm = () => {
    setName('');
    setShortName('');
    setAddress('');
    setCityId('');
    setNameError('');
    setShortNameError('');
    setAddressError('');
    setCityError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Название обязательно');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!shortName.trim()) {
      setShortNameError('Короткое название обязательно');
      isValid = false;
    } else {
      setShortNameError('');
    }

    if (!address.trim()) {
      setAddressError('Адрес обязателен');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (!cityId) {
      setCityError('Выберите город');
      isValid = false;
    } else {
      setCityError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addLocation({
        name,
        short_name: shortName,
        address,
        cityId
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Обработчик выбора города
  const handleCityChange = (value: string) => {
    console.log('Selected city ID:', value);
    setCityId(value);
    setIsSelectOpen(false);
  };

  // Обработчик открытия/закрытия селекта
  const handleSelectOpenChange = (open: boolean) => {
    setIsSelectOpen(open);
  };

  // Рендер опций городов
  const renderCityList = () => {
    if (!cities || cities.length === 0) {
      return <div className="p-2 text-gray-500">Нет доступных городов</div>;
    }

    return (
      <div className="max-h-60 overflow-auto">
        {cities.map((city) => (
          <div
            key={city.id}
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            onClick={() => handleCityChange(city.id)}
          >
            {city.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новую локацию</DialogTitle>
          <DialogDescription>
            Заполните все поля для создания новой локации
          </DialogDescription>
        </DialogHeader>
        
        {citiesError ? (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            Ошибка загрузки городов
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Название
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={nameError ? "border-red-500" : ""}
                  />
                  {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shortName" className="text-right">
                  Короткое название
                </Label>
                <div className="col-span-3">
                  <Input
                    id="shortName"
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className={shortNameError ? "border-red-500" : ""}
                  />
                  {shortNameError && <p className="text-sm text-red-500 mt-1">{shortNameError}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Адрес
                </Label>
                <div className="col-span-3">
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={addressError ? "border-red-500" : ""}
                  />
                  {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  Город
                </Label>
                <div className="col-span-3">
                  <div className="w-full relative">
                    {/* Заменим компонент Select на кастомную реализацию */}
                    <div className="relative">
                      <div 
                        className={`w-full px-3 py-2 border ${cityError ? "border-red-500" : "border-gray-300"} rounded-md flex items-center justify-between cursor-pointer`}
                        onClick={() => handleSelectOpenChange(!isSelectOpen)}
                      >
                        <span className="block truncate">
                          {cityId && cities ? 
                            cities.find(city => city.id === cityId)?.title : 
                            'Выберите город'
                          }
                        </span>
                        <span className="pointer-events-none">
                          <svg 
                            className={`h-5 w-5 transform ${isSelectOpen ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                      
                      {isSelectOpen && (
                        <div className="absolute z-[1000] w-full mt-1 py-1 border border-gray-300 rounded-md bg-white shadow-lg max-h-60 overflow-auto">
                          {renderCityList()}
                        </div>
                      )}
                    </div>
                    
                    {cityError && <p className="text-sm text-red-500 mt-1">{cityError}</p>}
                    <div className="mt-2 text-amber-500 text-sm">
                      {cities && cities.length === 0 && 'Нет доступных городов. Пожалуйста, сначала создайте город.'}
                      {!cities && !isCitiesLoading && 'Ошибка загрузки данных о городах.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose} type="button">
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Создание...' : 'Создать'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateLocationModal;