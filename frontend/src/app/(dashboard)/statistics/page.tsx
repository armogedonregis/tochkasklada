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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PaymentsStatisticsPage() {

  // Используем хук для управления состоянием таблицы
  const tableControls = useTableControls({
    defaultPageSize: 10
  });

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });


  // Получение данных статистики
  const { data: statsData, isLoading, error, refetch } = useGetStatisticsPaymentsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    startDate: dateRange.from?.toISOString(),
    endDate: dateRange.to?.toISOString()
  });



  const [expandedPayments, setExpandedPayments] = useState<string[]>([]);


  // Данные платежей из пагинированного ответа
  const stats = statsData?.data || [];
  // Используем мета-информацию из ответа
  const totalCount = statsData?.meta?.totalCount || 0;
  const pageCount = statsData?.meta?.totalPages || 1;

  // Функция для переключения раскрытия информации о клиенте
  const toggleExpandPayment = (paymentId: string) => {
    setExpandedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };


  // Форматирование суммы - отображаем только целые рубли
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Компонент для отображения расширенной информации о клиенте
  // const ExpandedClientInfo = ({ stat }: { stat: StatisticsPayments }) => {
  //   const user = stat?.user;

  //   const 

  //   if (!user) {
  //     return (
  //       <div className="p-4 pl-12 text-sm text-gray-500">
  //         Информация о клиенте недоступна
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="pl-12 pr-4 py-4 border-t border-gray-100">
  //       <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
  //         <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
  //           {/* <User size={16} /> */}
  //           Информация о клиенте
  //         </h4>
  //         <div className="grid grid-cols-2 gap-4 text-sm">
  //           <div>
  //             <p className="text-gray-500 dark:text-gray-400">ФИО:</p>
  //             <p className="font-medium">{user.client?.name}</p>
  //           </div>
  //           <div>
  //             <p className="text-gray-500 dark:text-gray-400">Email:</p>
  //             <p className="font-medium">{user?.email || 'Не указан'}</p>
  //           </div>
  //           <div className="col-span-2">
  //             <p className="text-gray-500 dark:text-gray-400 mb-1">Телефоны:</p>
  //             <div className="font-medium space-y-1">
  //               {user.client.phones && user.client.phones.length > 0 ? (
  //                 user.client.phones.map((phone: any, index: number) => (
  //                   <div key={index} className="bg-white dark:bg-gray-700 px-3 py-1 rounded">
  //                     {typeof phone === 'object' ? phone.phone || phone.number : phone}
  //                   </div>
  //                 ))
  //               ) : (
  //                 <div className="text-gray-400">Телефоны не указаны</div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // Определение колонок таблицы
  const columns: ColumnDef<StatisticsPayments>[] = [
    // {
    //   id: 'expander',
    //   header: '',
    //   cell: ({ row }) => {
    //     const isExpanded = expandedPayments.includes(row.original.locationId);
    //     return (
    //       <button
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           toggleExpandPayment(row.original.locationId);
    //         }}
    //         className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
    //       >
    //         {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    //       </button>
    //     );
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'cityName',
      header: "Город"
    },
    {
      accessorKey: 'cityShortName',
      header: "cityId"
    },
    {
      accessorKey: 'locationName',
      header: "Локация",
    },
    {
      accessorKey: 'locationShortName',
      header: "locId",
    },
    {
      accessorKey: 'totalPayments',
      header: "Платежи",
    },
    {
      accessorKey: 'totalAmount',
      header: "Общая сумма",
      cell: ({ row }) => {
        return <div>{formatAmount(row.original.totalAmount)}</div>;
      }
    },
    {
      accessorKey: 'averagePayment',
      header: "Средняя сумма",
      cell: ({ row }) => {
        return <div>{formatAmount(row.original.averagePayment)}</div>;
      }
    },
    {
      accessorKey: 'activeRentals',
      header: "Активные аренды",
    }
  ];

  const resetDateFilters = () => {
    setDateRange({ from: undefined, to: undefined });
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Панель добавления */}
      <div className="mb-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-bold">Статистика платежей</h1>
          <p className="text-sm text-muted-foreground">
            Анализ платежей по локациям
          </p>
        </div>
      </div>
      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 px-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Период с</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "dd.MM.yyyy") : <span>Выберите дату</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Период по</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, "dd.MM.yyyy") : <span>Выберите дату</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={resetDateFilters}
            className="w-full"
          >
            Сбросить даты
          </Button>
        </div>
      </div>


      {/* Таблица */}
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
        // sortableFields={PaymentSortField}
        pagination={tableControls.pagination}
        onPaginationChange={tableControls.handlePaginationChange}
        // sorting={tableControls.sorting}
        persistSettings={true}
      // renderRowSubComponent={({ row }) =>
      //   expandedPayments.includes(row.original.locationId) ? <ExpandedClientInfo stat={row.original} /> : null
      // }
      />
    </div>
  );
}