"use client";

import { useState } from 'react';
import { useGetFreeCellsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { useGetLocationsQuery } from '@/services/locationsService/locationsApi';
import { useGetSizesQuery } from '@/services/sizesService/sizesApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseTable } from '@/components/table/BaseTable';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { CellFreeRental, CellFreeSortField } from '@/services/cellRentalsService/cellRentals.types';
import { useTableControls } from '@/hooks/useTableControls';


export default function CellRentalsPage() {

  const tableControls = useTableControls<CellFreeSortField>({
    defaultPageSize: 10,
  });

  // Получение данных об арендах
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [sizeFilter, setSizeFilter] = useState<string>('ALL');

  const { data: locationsData = { data: [] } } = useGetLocationsQuery();
  const { data: sizes = [] } = useGetSizesQuery();

  const { data, error, isLoading, refetch } = useGetFreeCellsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection,
    locationId: locationFilter === 'ALL' ? undefined : locationFilter,
    sizeId: sizeFilter === 'ALL' ? undefined : sizeFilter,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    tableControls.handleSearchChange(search);
  };

  // Данные аренд
  const cellRentals = data?.data || [];

  const totalCount = data?.meta?.totalCount || 0;
  const pageCount = data?.meta?.totalPages || 1;


  const columns: ColumnDef<CellFreeRental>[] = [
    {
      accessorKey: 'name',
      header: 'Номер ячейки',
      cell: ({ row }) => row.original.name
    },
    {
      accessorKey: 'location',
      header: 'Локация',
      cell: ({ row }) => row.original.container.location?.name + '(' + row.original.container.location?.short_name + ')'
    },
    {
      accessorKey: 'city',
      header: 'Город',
      cell: ({ row }) => row.original.container.location?.city?.title
    },
    {
      accessorKey: 'size',
      header: 'Размер',
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

      {/* Фильтры и поиск (единый grid, как на странице cell-rentals) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 px-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по ячейке, размеру или локации..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div>
          <Select value={locationFilter} onValueChange={(value) => setLocationFilter(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Фильтр по локации" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все локации</SelectItem>
              {locationsData?.data?.map((location: any) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} ({location.city?.short_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={sizeFilter} onValueChange={(value) => setSizeFilter(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Фильтр по размеру" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все размеры</SelectItem>
              {sizes?.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.short_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <BaseTable
        data={cellRentals}
        columns={columns}
        disableActions={true}
        tableId="free-cells-table"
        totalCount={totalCount}
        pageCount={pageCount}
        onPaginationChange={tableControls.handlePaginationChange}
        onSortingChange={tableControls.handleSortingChange}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        persistSettings={true}
        sortableFields={CellFreeSortField}
        pagination={tableControls.pagination}
        sorting={tableControls.sorting}
      />
    </div>
  );
}