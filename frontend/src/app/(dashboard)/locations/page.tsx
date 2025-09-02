'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGetMyLocationsQuery, useGetMyLocationSnapshotQuery } from '@/services/rolesService/rolesApi';
import { Button } from '@/components/ui/button';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';

export default function OperatorLocationOverviewPage() {
  const { data: myLocationsData, isLoading: isLoadingLocations, refetch: refetchLocations } = useGetMyLocationsQuery();
  const locations = myLocationsData?.data || [];

  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedLocationId && locations.length === 1) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId]);

  const { data: snapshotData, isLoading: isLoadingSnapshot, refetch: refetchSnapshot } = useGetMyLocationSnapshotQuery(
    selectedLocationId || '',
    { skip: !selectedLocationId }
  );

  const snapshot = snapshotData?.data || {} as any;

  const tableRows = useMemo(() => {
    const cells = Array.isArray(snapshot?.cells) ? snapshot.cells : [];
    return cells.map((c: any) => ({
      id: c.id,
      number: c.number || c.name,
      status: c.statusLabel || c.status?.name || c.status || '-',
      rentalEnd: c.rentalEnd || c.rentEnd || c.endDate || c?.rentals?.[0]?.endDate || null,
      client: c.clientName || c.client?.name || '-',
    }));
  }, [snapshot]);

  const columns = useMemo<ColumnDef<any>[]>(() => ([
    { accessorKey: 'number', header: 'Номер' },
    { accessorKey: 'status', header: 'Статус' },
    { accessorKey: 'rentalEnd', header: 'Аренда до',
      cell: ({ row }) => row.original.rentalEnd ? new Date(row.original.rentalEnd).toLocaleDateString() : '-' },
    { accessorKey: 'client', header: 'Клиент' },
  ]), []);

  const handleRefresh = () => {
    refetchLocations();
    if (selectedLocationId) refetchSnapshot();
  };

  const locationOptions = useMemo(() => (
    locations.map((loc: any) => ({ value: loc.id, label: loc.name || loc.short_name || 'Локация' }))
  ), [locations]);

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl font-semibold">Обзор площадки</h1>
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 bg-white dark:bg-gray-900"
            value={selectedLocationId || ''}
            onChange={(e) => setSelectedLocationId(e.target.value || undefined)}
            disabled={isLoadingLocations}
          >
            <option value="" disabled>
              {isLoadingLocations ? 'Загрузка локаций...' : 'Выберите локацию'}
            </option>
            {locationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button onClick={handleRefresh} variant="outline">Обновить</Button>
        </div>
      </div>

      {!selectedLocationId && !isLoadingLocations && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Выберите доступную локацию, чтобы увидеть сводку.
        </div>
      )}

      {selectedLocationId && (
        <div className="space-y-4">
          {isLoadingSnapshot ? (
            <div className="text-sm text-gray-600 dark:text-gray-300">Загрузка среза...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Всего ячеек</div>
                  <div className="text-lg font-semibold">{snapshot?.cellsTotal ?? '-'}</div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Заняты</div>
                  <div className="text-lg font-semibold">{snapshot?.cellsOccupied ?? '-'}</div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Свободны</div>
                  <div className="text-lg font-semibold">{snapshot?.cellsFree ?? '-'}</div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-xs text-gray-500">Просрочены</div>
                  <div className="text-lg font-semibold">{snapshot?.cellsExpired ?? '-'}</div>
                </div>
              </div>

              {Array.isArray(snapshot?.sizesBreakdown) && snapshot.sizesBreakdown.length > 0 && (
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium mb-2">Разбивка по размерам</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {snapshot.sizesBreakdown.map((sb: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                        <span className="text-sm">{sb.sizeLabel || sb.size || 'Размер'}</span>
                        <span className="text-sm font-semibold">{sb.count ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl border">
                <BaseTable
                  data={tableRows}
                  columns={columns}
                  searchColumn="number"
                  searchPlaceholder="Поиск по номеру ячейки..."
                  isDisabledPagination
                  isDisabledSorting={false}
                  tableId="location-overview-cells"
                  className="border-0"
                />
              </div>

              {Array.isArray(snapshot?.recentPayments) && snapshot.recentPayments.length > 0 && (
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium mb-2">Недавние операции</div>
                  <ul className="space-y-2">
                    {snapshot.recentPayments.map((p: any) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <span>{p.clientName || p.clientEmail || 'Клиент'}</span>
                        <span>{p.amount ? `${p.amount} ₽` : ''}</span>
                        <span className="text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


