'use client';

import { useState } from 'react';
import { useGetLocationsQuery, useAddLocationMutation } from '@/services/locationsApi';
import { useGetCitiesQuery } from '@/services/citiesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationTable } from '@/components/Location/LocationTable';
import CreateLocationModal from '@/components/modals/CreateLocationModal';

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: locations, error, isLoading } = useGetLocationsQuery();
  const { data: cities, isLoading: isCitiesLoading } = useGetCitiesQuery();
  const [addLocation] = useAddLocationMutation();

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

  const isPageLoading = isLoading || isCitiesLoading;

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
          Добавить локацию
        </Button>
      </div>

      {/* Основное содержимое */}
      {error ? (
        renderErrorState()
      ) : isPageLoading ? (
        renderLoadingState()
      ) : (
        <LocationTable locations={locations || []} searchQuery={searchQuery} />
      )}

      <CreateLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
} 