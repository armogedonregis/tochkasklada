'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useGetStatisticsPaymentsQuery } from '@/services/paymentsService/paymentsApi';
import { Button } from '@/components/ui/button';
import { formatDate } from 'date-fns/format';

export default function PaymentsStatisticsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Получение данных статистики
  const { data: statsData, isLoading, error, refetch } = useGetStatisticsPaymentsQuery();

  // Фильтрация данных по поисковому запросу
  const filteredData = statsData?.filter(location => 
    location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Статистика платежей</h1>
          <p className="text-sm text-muted-foreground">
            Анализ платежей по локациям
          </p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по локации или городу..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end">
          <Badge variant="outline" className="mr-2">
            Всего локаций: {statsData?.length || 0}
          </Badge>
          <Badge variant="outline">
            Найдено: {filteredData.length}
          </Badge>
        </div>
      </div>

      {/* Состояние загрузки */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Состояние ошибки */}
      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 mb-4">Ошибка загрузки данных</div>
          <Button variant="outline" onClick={refetch}>
            Повторить попытку
          </Button>
        </div>
      )}

      {/* Состояние без данных */}
      {!isLoading && !error && filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Локации не найдены</h3>
          <p className="text-sm text-muted-foreground">
            Попробуйте изменить параметры поиска
          </p>
        </div>
      )}

      {/* Отображение данных */}
      {!isLoading && !error && filteredData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((location) => (
            <Card key={location.locationId} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  {location.locationName}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {location.cityName} ({location.cityShortName})
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Платежи:</span>
                  <span className="font-medium">{location.totalPayments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Сумма:</span>
                  <span className="font-medium">{location.totalAmount} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Аренды:</span>
                  <span className="font-medium">{location.activeRentals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Средний чек:</span>
                  <span className="font-medium">{location.averagePayment.toFixed(2)} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Последний платеж:</span>
                  <span className="font-medium">
                    {location.lastPaymentDate ? formatDate(location.lastPaymentDate, 'dd.MM.yyyy') : 'Нет данных'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Дополнительная аналитика */}
      {!isLoading && !error && filteredData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Сводная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Общая сумма</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredData.reduce((sum, loc) => sum + loc.totalAmount, 0)} ₽
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Всего платежей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredData.reduce((sum, loc) => sum + loc.totalPayments, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Средний чек</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    filteredData.reduce((sum, loc) => sum + loc.totalAmount, 0) / 
                    Math.max(filteredData.reduce((sum, loc) => sum + loc.totalPayments, 0), 1)
                  ).toFixed(2)} ₽
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}