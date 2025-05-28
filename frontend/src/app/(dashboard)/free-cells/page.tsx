"use client";

import {
  useGetFreeCellsQuery
} from '@/services/cellRentalsService/cellRentalsApi';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { CellFreeRental, CellFreeSortField } from '@/services/cellRentalsService/cellRentals.types';
import { useTableControls } from '@/hooks/useTableControls';


export default function CellRentalsPage() {

  const tableControls = useTableControls<CellFreeSortField>({
    defaultPageSize: 10,
  });

  // Получение данных об арендах
  const { data, error, isLoading, refetch } = useGetFreeCellsQuery({
    page: tableControls.queryParams.page,
    limit: tableControls.queryParams.limit,
    search: tableControls.queryParams.search,
    sortBy: tableControls.queryParams.sortBy,
    sortDirection: tableControls.queryParams.sortDirection,
  });

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

      <BaseTable
        data={cellRentals}
        columns={columns}
        disableActions={true}
        tableId="free-cells-table"
        searchColumn="name"
        searchPlaceholder="Поиск по названию ячейки..."
        onSearchChange={tableControls.handleSearchChange}
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