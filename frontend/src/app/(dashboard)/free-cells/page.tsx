"use client";

import { useState } from 'react';
import {
  useGetFreeCellsQuery
} from '@/services/cellRentalsService/cellRentalsApi';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


export default function CellRentalsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Получение данных об арендах
  const { data, error, isLoading, refetch } = useGetFreeCellsQuery({
    // cityId?: string,
    // locationId?: string,
    // sizeId?: string
  });

  // Данные аренд
  const cellRentals = data || [];


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок и кнопка добавления */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Свободные ячейками</h1>
          <p className="text-sm text-muted-foreground">
            Просмотр свободных ячеек
          </p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ячейке..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        <div className="flex items-center justify-end">
          <Badge variant="outline" className="mr-2">
            Всего: {cellRentals.length}
          </Badge>
          <Badge variant="outline">
            Найдено: {cellRentals.length}
          </Badge>
        </div>
      </div>

      {/* Список ячеек */}
      {cellRentals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Ячейки не найдены</h3>
          <p className="text-sm text-muted-foreground">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cellRentals.map((rental) => (
            <Card key={rental.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    Ячейка {rental?.name}
                  </CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  Контейнер №{rental.container?.name > 10 ? rental.container?.name : '0' + rental.container?.name}
                </div>
              </CardHeader>


              <CardContent className="space-y-2">
                <div>
                  Город: {rental.container.location?.city?.title}({rental.container.location?.city?.short_name})
                </div>
                <div>
                  Локация: {rental.container.location?.name}({rental.container.location?.short_name})
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}