'use client';

import { useGetStatisticsPaymentsQuery } from '@/services/statisticsService/statisticsApi';
import { BaseTable } from '@/components/table/BaseTable';
import { useTableControls } from '@/hooks/useTableControls';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { StatisticsPayments } from '@/services/statisticsService/statistics.types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronDown, ChevronRight, Download, TrendingUp, Users, Banknote, Building, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ru } from 'date-fns/locale';
import LocationPaymentsDetail from '@/components/LocationPaymentsDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DateRange } from 'react-day-picker';

export default function PaymentsStatisticsPage() {
  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls({
    defaultPageSize: 10
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Получение данных статистики
  const { data: statsData, isLoading, error, refetch } = useGetStatisticsPaymentsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    startDate: dateRange?.from?.toISOString(),
    endDate: dateRange?.to?.toISOString()
  });

  // Данные платежей из пагинированного ответа
  const stats = statsData?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = statsData?.meta?.totalCount || 0;
  const pageCount = statsData?.meta?.totalPages || 1;

  // Функция для переключения раскрытия строки
  const toggleExpandRow = (locationId: string) => {
    setExpandedRows(prev =>
      prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
    );
  };

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd.MM.yyyy', { locale: ru });
  };

  // Экспорт общей статистики в Excel
  const handleExportOverall = async () => {
    try {
      const XLSX = await import('xlsx');

      const exportData = stats.map(stat => ({
        'Город': stat.cityName,
        'Код города': stat.cityShortName,
        'Локация': stat.locationName,
        'Код локации': stat.locationShortName,
        'Количество платежей': stat.totalPayments,
        'Общая сумма': stat.totalAmount,
        'Средняя сумма платежа': stat.averagePayment,
        'Активные аренды': stat.activeRentals,
        'Доход с аренды': stat.revenuePerRental,
        'Последний платеж': formatDate(stat.lastPaymentDate),
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Статистика');

      const fileName = `статистика_локаций_${format(new Date(), 'dd-MM-yyyy_HH-mm')}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };

  // Вычисление общих показателей
  const overallStats = stats.reduce((acc, stat) => ({
    totalLocations: acc.totalLocations + 1,
    totalPayments: acc.totalPayments + stat.totalPayments,
    totalAmount: acc.totalAmount + stat.totalAmount,
    totalActiveRentals: acc.totalActiveRentals + stat.activeRentals,
    totalRentals: acc.totalRentals + stat.totalRentals,
  }), { totalLocations: 0, totalPayments: 0, totalAmount: 0, totalActiveRentals: 0, totalRentals: 0 });

  // Определение колонок таблицы
  const columns: ColumnDef<StatisticsPayments>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const isExpanded = expandedRows.includes(row.original.locationId);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandRow(row.original.locationId);
            }}
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'cityName',
      header: 'Город',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.cityName}</div>
          <div className="text-sm text-gray-500">{row.original.cityShortName}</div>
        </div>
      ),
    },
    {
      accessorKey: 'locationName',
      header: 'Локация',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.locationName}</div>
          <div className="text-sm text-gray-500">{row.original.locationShortName}</div>
        </div>
      ),
    },
    {
      accessorKey: 'totalPayments',
      header: 'Платежи',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold">{row.original.totalPayments}</div>
          <div className="text-xs text-gray-500">шт.</div>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Общая сумма',
      cell: ({ row }) => (
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            {formatAmount(row.original.totalAmount)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'averagePayment',
      header: 'Средний платеж',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-medium">{formatAmount(row.original.averagePayment)}</div>
        </div>
      ),
    },
    {
      accessorKey: 'activeRentals',
      header: 'Аренды',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">{row.original.activeRentals}</div>
          <div className="text-xs text-gray-500">
            из {row.original.totalRentals} всего
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'lastPaymentDate',
      header: 'Последний платеж',
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.original.lastPaymentDate)}</div>
      ),
    },
  ];

  const resetDateFilters = () => {
    setDateRange(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Статистика платежей</h1>
        <p className="text-muted-foreground">
          Анализ платежей и доходов по локациям
        </p>
      </div>

      {/* Общие показатели */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего локаций</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего платежей</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(overallStats.totalAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Аренды</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallStats.totalActiveRentals}</div>
            <div className="text-xs text-muted-foreground">
              из {overallStats.totalRentals} всего
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Фильтры и управление */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и экспорт</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range Picker */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Период</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd.MM.yyyy", { locale: ru })} -{" "}
                            {format(dateRange.to, "dd.MM.yyyy", { locale: ru })}
                          </>
                        ) : (
                          format(dateRange.from, "dd.MM.yyyy", { locale: ru })
                        )
                      ) : (
                        <span>Выберите период</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ru}
                      weekStartsOn={1}
                      className="rounded-md"
                      modifiersClassNames={{
                        selected: "bg-primary text-primary-foreground",
                        today: "bg-accent text-accent-foreground",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                
                {dateRange && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetDateFilters}
                    className="shrink-0"
                    title="Сбросить период"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Показываем выбранный период под календарем */}
              {dateRange?.from && (
                <div className="text-xs text-muted-foreground mt-1">
                  {dateRange.to ? (
                    <>
                      Период: {format(dateRange.from, "dd MMM yyyy", { locale: ru })} - {format(dateRange.to, "dd MMM yyyy", { locale: ru })}
                    </>
                  ) : (
                    <>
                      Начальная дата: {format(dateRange.from, "dd MMM yyyy", { locale: ru })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Быстрые фильтры */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Быстрые фильтры</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setDateRange({ from: lastWeek, to: today });
                  }}
                >
                  7 дней
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setDateRange({ from: lastMonth, to: today });
                  }}
                >
                  30 дней
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    setDateRange({ from: thisMonth, to: today });
                  }}
                >
                  Этот месяц
                </Button>
              </div>
            </div>

            {/* Экспорт */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Экспорт данных</label>
              <Button
                onClick={handleExportOverall}
                className="w-full"
                disabled={!stats.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Экспорт статистики
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица с раскрывающимися строками */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика по локациям</CardTitle>
          <CardDescription>
            Нажмите на стрелку для просмотра детальных платежей по локации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BaseTable
            data={stats}
            columns={columns}
            disableActions
            tableId="statistics-table"
            totalCount={totalCount}
            pageCount={pageCount}
            isDisabledSorting
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
            pagination={tableControls.pagination}
            onPaginationChange={tableControls.handlePaginationChange}
            persistSettings={true}
            renderRowSubComponent={({ row }) => (
              <LocationPaymentsDetail
                locationId={row.original.locationId}
                locationName={row.original.locationName}
                startDate={dateRange?.from}
                endDate={dateRange?.to}
                isOpen={expandedRows.includes(row.original.locationId)}
                onToggle={() => toggleExpandRow(row.original.locationId)}
              />
            )}
            searchPlaceholder="Поиск недоступен"
          />
        </CardContent>
      </Card>
    </div>
  );
}