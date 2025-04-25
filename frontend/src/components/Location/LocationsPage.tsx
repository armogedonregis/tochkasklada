'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ContainerTable } from './ContainerTable';
import { CellTable } from './CellTable';
import { CityTable } from './CityTable';
import { LocationTable } from './LocationTable';

// Примеры данных
const mockCities = [
  { id: '1', title: 'Москва', short_name: 'MSK' },
  { id: '2', title: 'Санкт-Петербург', short_name: 'SPB' },
  { id: '3', title: 'Казань', short_name: 'KZN' },
];

const mockLocations = [
  { id: '1', name: 'ТЦ Мега', short_name: 'Мега', address: 'ул. Ленина, 100', cityId: '1' },
  { id: '2', name: 'ТЦ Рио', short_name: 'Рио', address: 'пр. Невский, 50', cityId: '2' },
  { id: '3', name: 'ТЦ Европа', short_name: 'Европа', address: 'ул. Баумана, 25', cityId: '3' },
];

const mockContainers = [
  { id: 1, locationId: '1', cellsCount: 10 },
  { id: 2, locationId: '1', cellsCount: 15 },
  { id: 3, locationId: '2', cellsCount: 8 },
  { id: 4, locationId: '3', cellsCount: 12 },
];

const mockCells = [
  { id: 1, containerId: 1, status: 'empty' as const },
  { id: 2, containerId: 1, status: 'occupied' as const },
  { id: 3, containerId: 2, status: 'reserved' as const },
  { id: 4, containerId: 3, status: 'maintenance' as const },
  { id: 5, containerId: 4, status: 'empty' as const },
];

export default function LocationsPage() {
  const [activeTab, setActiveTab] = useState("cities");
  const [searchQuery, setSearchQuery] = useState("");

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Локации</h1>
        <Button>Добавить {activeTab === "cities" ? "город" : 
                          activeTab === "locations" ? "локацию" : 
                          activeTab === "containers" ? "контейнер" : "ячейку"}</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cities">Города</TabsTrigger>
          <TabsTrigger value="locations">Локации</TabsTrigger>
          <TabsTrigger value="containers">Контейнеры</TabsTrigger>
          <TabsTrigger value="cells">Ячейки</TabsTrigger>
        </TabsList>

        <TabsContent value="cities">
          <CityTable cities={mockCities} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="locations">
          <LocationTable locations={mockLocations} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="containers">
          <ContainerTable containers={mockContainers} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="cells">
          <CellTable cells={mockCells} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 