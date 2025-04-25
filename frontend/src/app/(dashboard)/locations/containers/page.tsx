'use client';

import { useState } from 'react';
import { useGetContainersQuery } from '@/services/containersApi';
import { useGetLocationsQuery } from '@/services/locationsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContainerTable } from '@/components/Location/ContainerTable';
import CreateContainerModal from '@/components/modals/CreateContainerModal';

export default function ContainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: containers, error, isLoading } = useGetContainersQuery();
  const { data: locations, isLoading: isLocationsLoading } = useGetLocationsQuery();

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

  const isPageLoading = isLoading || isLocationsLoading;

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
          Добавить контейнер
        </Button>
      </div>

      {/* Основное содержимое */}
      {error ? (
        renderErrorState()
      ) : isPageLoading ? (
        renderLoadingState()
      ) : (
        <ContainerTable containers={containers || []} searchQuery={searchQuery} />
      )}

      <CreateContainerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locations={locations || []}
      />
    </>
  );
} 