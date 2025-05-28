"use client";

import { useState } from 'react';
import {
  useGetFreeCellsQuery
} from '@/services/cellRentalsService/cellRentalsApi';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { CellFreeRental } from '@/services/cellRentalsService/cellRentals.types';


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


  const columns: ColumnDef<CellFreeRental>[] = [
    {
      accessorKey: 'name',
      header: 'Номер ячейки',
      cell: ({ row }) => row.original.name
    },
    {
      accessorKey: 'container.location.name',
      header: 'Локация',
      cell: ({ row }) => row.original.container.location?.name + '(' + row.original.container.location?.short_name + ')'
    },
    {
      accessorKey: 'container.location.city.name',
      header: 'Город',
      cell: ({ row }) => row.original.container.location?.city?.title
    },
    {
      accessorKey: 'size.name',
      header: 'Город',
      cell: ({ row }) => row.original.size?.name + '(' + row.original.size?.short_name + ')'
    },
  ];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <div>
          <h1 className="text-2xl font-bold">Свободные ячейками</h1>
          <p className="text-sm text-muted-foreground">
            Просмотр свободных ячеек
          </p>
        </div>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-2 mb-4 px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ячейке..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <BaseTable
        data={cellRentals}
        columns={columns}
        disableActions={true}
        tableId="free-cells-table"
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        persistSettings={true}
      />

    </div>
  );
}