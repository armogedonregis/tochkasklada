'use client';

import { useState } from 'react';
import { useGetCitiesQuery, useAddCityMutation } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CityTable } from '@/components/Location/CityTable';
import CreateCityModal from '@/components/modals/CreateCityModal';

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: cities, error, isLoading } = useGetCitiesQuery();
  const [addCity] = useAddCityMutation();

  const handleAddCity = async (data: { title: string; short_name: string }) => {
    try {
      await addCity({
        title: data.title,
        short_name: data.short_name
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при добавлении города:', error);
    }
  };

  const renderErrorState = () => (
    <div className="py-12 text-center">
      <h3 className="text-xl text-red-500 mb-2">Ошибка при загрузке данных</h3>
      <p className="text-gray-500 mb-4">Не удалось загрузить данные с сервера</p>
      <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="py-12 text-center">
      <h3 className="text-xl mb-2">Загрузка данных...</h3>
      <p className="text-gray-500">Пожалуйста, подождите</p>
    </div>
  );

  return (
    <>
      {/* Панель поиска и добавления */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/3">
          <Input
            type="search"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Добавить город
        </Button>
      </div>

      {/* Основное содержимое */}
      {error ? (
        renderErrorState()
      ) : isLoading ? (
        renderLoadingState()
      ) : (
        <CityTable cities={cities || []} searchQuery={searchQuery} />
      )}

      <CreateCityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCity}
      />
    </>
  );
} 