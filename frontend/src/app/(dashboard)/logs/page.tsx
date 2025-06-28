'use client';

import { useGetLogsQuery } from '@/services/logsService/logsApi';
import { Button } from '@/components/ui/button';

export default function LogsPage() {
  const { data = [], refetch, isFetching } = useGetLogsQuery(300);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Логи сервера</h1>
      <Button onClick={() => refetch()} disabled={isFetching}>
        Обновить
      </Button>
      <pre className="whitespace-pre-wrap mt-4 bg-gray-900 text-gray-100 p-4 rounded max-h-[80vh] overflow-auto text-sm">
        {data.join('\n')}
      </pre>
    </div>
  );
} 