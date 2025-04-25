'use client';

import React, { useEffect, useState } from 'react';
import { useAddCellMutation } from '@/services/cellsApi';
import { useGetContainersQuery } from '@/services/containersApi';
import { useGetSizesQuery } from '@/services/sizesApi';
import { toast } from 'react-toastify';
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
import { Check, ChevronDown } from 'lucide-react';

interface CreateCellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CellLetter {
  value: string;
  isSelected: boolean;
  sizeId: string;
  dimensions: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const CreateCellModal: React.FC<CreateCellModalProps> = ({ isOpen, onClose }) => {
  // Основные данные
  const [containerId, setContainerId] = useState<number | null>(null);
  const [letters, setLetters] = useState<CellLetter[]>(
    LETTERS.map(letter => ({ 
      value: letter, 
      isSelected: false,
      sizeId: '',
      dimensions: ''
    }))
  );

  // Валидация
  const [containerError, setContainerError] = useState('');
  const [lettersError, setLettersError] = useState('');
  const [selectedLetterErrors, setSelectedLetterErrors] = useState<Record<string, { sizeError?: string, dimensionsError?: string }>>({});

  // Состояние выпадающих списков
  const [isContainerSelectOpen, setIsContainerSelectOpen] = useState(false);
  const [openSizeSelects, setOpenSizeSelects] = useState<Record<string, boolean>>({});

  // Запросы к API
  const { data: containers, isLoading: isContainersLoading } = useGetContainersQuery();
  const { data: sizes, isLoading: isSizesLoading } = useGetSizesQuery();
  const [addCell, { isLoading, isSuccess, error }] = useAddCellMutation();

  // Отслеживание успешного добавления
  useEffect(() => {
    if (isSuccess) {
      toast.success('Ячейки успешно созданы');
      resetForm();
      onClose();
    }
  }, [isSuccess, onClose]);

  // Отслеживание ошибок
  useEffect(() => {
    if (error) {
      toast.error('Ошибка при создании ячеек');
    }
  }, [error]);

  // Сброс формы
  const resetForm = () => {
    setContainerId(null);
    setLetters(LETTERS.map(letter => ({ 
      value: letter, 
      isSelected: false,
      sizeId: '',
      dimensions: ''
    })));
    setContainerError('');
    setLettersError('');
    setSelectedLetterErrors({});
    setIsContainerSelectOpen(false);
    setOpenSizeSelects({});
  };

  // Валидация формы
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, { sizeError?: string, dimensionsError?: string }> = {};

    if (!containerId) {
      setContainerError('Выберите контейнер');
      isValid = false;
    } else {
      setContainerError('');
    }

    const selectedLetters = letters.filter(letter => letter.isSelected);
    
    if (selectedLetters.length === 0) {
      setLettersError('Выберите хотя бы одну букву');
      isValid = false;
    } else {
      setLettersError('');
      
      // Проверка заполнения размеров для выбранных букв
      selectedLetters.forEach(letter => {
        newErrors[letter.value] = {};
        
        if (!letter.sizeId) {
          newErrors[letter.value].sizeError = 'Выберите размер';
          isValid = false;
        }
        
        if (!letter.dimensions) {
          newErrors[letter.value].dimensionsError = 'Укажите размеры';
          isValid = false;
        }
      });
    }
    
    setSelectedLetterErrors(newErrors);
    return isValid;
  };

  // Обработка переключения чекбокса
  const handleLetterToggle = (value: string) => {
    setLetters(
      letters.map(letter => 
        letter.value === value 
          ? { ...letter, isSelected: !letter.isSelected } 
          : letter
      )
    );
  };

  // Изменение размера ячейки
  const handleSizeChange = (value: string, letterValue: string) => {
    setLetters(
      letters.map(letter => 
        letter.value === letterValue
          ? { ...letter, sizeId: value }
          : letter
      )
    );
    // Закрыть селект после выбора
    toggleSizeSelect(letterValue);
  };

  // Изменение размеров ячейки
  const handleDimensionsChange = (value: string, letterValue: string) => {
    setLetters(
      letters.map(letter => 
        letter.value === letterValue
          ? { ...letter, dimensions: value }
          : letter
      )
    );
  };

  // Отправка формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Получаем выбранные буквы
      const selectedLetters = letters.filter(letter => letter.isSelected);
      
      // Создаем ячейки для каждой выбранной буквы
      selectedLetters.forEach(letter => {
        const cellData = {
          name: letter.value,
          containerId: containerId!,
          size_id: letter.sizeId,
          len_height: letter.dimensions,
        };
        
        addCell(cellData);
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Переключение состояния контейнер-селекта
  const toggleContainerSelect = () => {
    if (!isContainersLoading) {
      setIsContainerSelectOpen(!isContainerSelectOpen);
    }
  };

  // Выбор контейнера
  const handleContainerSelect = (id: number) => {
    setContainerId(id);
    setIsContainerSelectOpen(false);
  };

  // Переключение состояния размер-селекта
  const toggleSizeSelect = (letterValue: string) => {
    if (!isSizesLoading) {
      setOpenSizeSelects(prev => ({
        ...prev,
        [letterValue]: !prev[letterValue]
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить ячейку</DialogTitle>
          <DialogDescription>
            Заполните форму для создания новых ячеек
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Выбор контейнера */}
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="container" className="col-span-1 text-right">
              Выбрать контейнер: <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-4 relative">
              <div 
                className={`flex items-center justify-between border rounded-md p-2 cursor-pointer ${containerError ? 'border-red-500' : 'border-gray-300'}`}
                onClick={toggleContainerSelect}
              >
                <span className={`${!containerId ? 'text-gray-500' : 'text-gray-900'}`}>
                  {containerId ? `Контейнер ${containerId}` : 'Выберите контейнер'}
                </span>
                <ChevronDown className={`h-4 w-4 ${isContainerSelectOpen ? 'transform rotate-180' : ''}`} />
              </div>
              
              {isContainerSelectOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {containers?.map((container) => (
                    <div 
                      key={container.id} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleContainerSelect(container.id)}
                    >
                      {containerId === container.id && <Check className="h-4 w-4 mr-2 text-green-500" />}
                      <span>Контейнер {container.id}</span>
                    </div>
                  ))}
                  {(!containers || containers.length === 0) && (
                    <div className="px-4 py-2 text-gray-500">Нет доступных контейнеров</div>
                  )}
                </div>
              )}
              
              {containerError && <p className="text-sm text-red-500 mt-1">{containerError}</p>}
            </div>
          </div>

          {/* Выбор букв ячеек и их параметров */}
          <div>
            <h3 className="text-base font-medium mb-3">Выберите ячейки для создания <span className="text-red-500">*</span></h3>
            <p className="text-sm text-gray-500 mb-2">У контейнера не может быть больше 8 ячеек.</p>
            
            {/* Заголовки для таблицы параметров */}
            <div className="grid grid-cols-12 gap-4 mb-2 px-3 py-2 bg-gray-50 rounded-t-md border-b">
              <div className="col-span-2 font-medium">Буква</div>
              <div className="col-span-5 font-medium">Размер ячейки</div>
              <div className="col-span-5 font-medium">Длина, высота, ширина</div>
            </div>
            
            <div className="border rounded-b-md divide-y">
              {letters.map((letter) => (
                <div key={letter.value} className="grid grid-cols-12 gap-4 items-center px-3 py-2">
                  <div className="col-span-2 flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id={`letter-${letter.value}`} 
                      checked={letter.isSelected}
                      onChange={() => handleLetterToggle(letter.value)}
                      className="h-4 w-4 rounded"
                    />
                    <Label htmlFor={`letter-${letter.value}`} className="font-medium cursor-pointer">
                      {letter.value}
                    </Label>
                  </div>
                  
                  {letter.isSelected ? (
                    <>
                      <div className="col-span-5 relative">
                        <div 
                          className={`flex items-center justify-between border rounded-md p-2 cursor-pointer ${selectedLetterErrors[letter.value]?.sizeError ? 'border-red-500' : 'border-gray-300'}`}
                          onClick={() => toggleSizeSelect(letter.value)}
                        >
                          <span className={`${!letter.sizeId ? 'text-gray-500' : 'text-gray-900'}`}>
                            {letter.sizeId ? 
                              sizes?.find(size => size.id === letter.sizeId)?.name || 'Выберите размер' : 
                              'Выберите размер'}
                          </span>
                          <ChevronDown className={`h-4 w-4 ${openSizeSelects[letter.value] ? 'transform rotate-180' : ''}`} />
                        </div>
                        
                        {openSizeSelects[letter.value] && (
                          <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {sizes?.map((size) => (
                              <div 
                                key={size.id} 
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => handleSizeChange(size.id, letter.value)}
                              >
                                {letter.sizeId === size.id && <Check className="h-4 w-4 mr-2 text-green-500" />}
                                <span>{size.name}</span>
                              </div>
                            ))}
                            {(!sizes || sizes.length === 0) && (
                              <div className="px-4 py-2 text-gray-500">Нет доступных размеров</div>
                            )}
                          </div>
                        )}
                        
                        {selectedLetterErrors[letter.value]?.sizeError && (
                          <p className="text-sm text-red-500 mt-1">{selectedLetterErrors[letter.value].sizeError}</p>
                        )}
                      </div>
                      
                      <div className="col-span-5">
                        <Input
                          type="text"
                          placeholder="2x2,4x1,75"
                          value={letter.dimensions}
                          onChange={(e) => handleDimensionsChange(e.target.value, letter.value)}
                          className={selectedLetterErrors[letter.value]?.dimensionsError ? "border-red-500" : ""}
                        />
                        {selectedLetterErrors[letter.value]?.dimensionsError && (
                          <p className="text-sm text-red-500 mt-1">{selectedLetterErrors[letter.value].dimensionsError}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="col-span-10 text-gray-400">
                      Выберите эту букву, чтобы добавить параметры
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {lettersError && <p className="text-sm text-red-500 mt-1">{lettersError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} type="button">
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Добавление...' : 'Добавить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCellModal; 