// app/(dashboard)/gantt/page.tsx
'use client';

import { useGetGanttRentalsQuery } from '@/services/cellRentalsService/cellRentalsApi';
import { Button } from '@/components/ui/button';
import { addMonths, subMonths } from 'date-fns';
import { useState } from 'react';
import TimelineGantt from '@/components/TimeLineGantt';

export default function GanttPage() {
  const [dateRange] = useState(() => {
    const now = new Date();
    return {
      start: subMonths(now, 3),
      end: addMonths(now, 3)
    };
  });

  const { data: rentalsData, isLoading, error, refetch } = useGetGanttRentalsQuery({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString()
  });

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">Ошибка загрузки данных</div>
          <Button onClick={() => refetch()} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {rentalsData?.data && <TimelineGantt tasks={rentalsData.data} />}
    </div>
  );
}