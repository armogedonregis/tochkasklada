'use client';

import { useState, useEffect } from 'react';
import { useGetLogsQuery, useGetLogFilesQuery } from '@/services/logsService/logsApi';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LogsPage() {
  const [selectedFile, setSelectedFile] = useState<string>('');

  const { data: logFiles = [], isLoading: isFilesLoading } = useGetLogFilesQuery();
  const {
    data: logs = [],
    refetch,
    isFetching,
  } = useGetLogsQuery({ file: selectedFile, lines: 500 }, { skip: !selectedFile });

  useEffect(() => {
    if (logFiles.length > 0 && !selectedFile) {
      setSelectedFile(logFiles[0]);
    }
  }, [logFiles, selectedFile]);

  const handleFileChange = (file: string) => {
    setSelectedFile(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Логи сервера</h1>
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={handleFileChange}
          value={selectedFile}
          disabled={isFilesLoading || logFiles.length === 0}
        >
          <SelectTrigger className="w-[380px]">
            <SelectValue placeholder="Выберите файл логов" />
          </SelectTrigger>
          <SelectContent>
            {logFiles.map((file) => (
              <SelectItem key={file} value={file}>
                {file}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => refetch()} disabled={isFetching || !selectedFile}>
          Обновить
        </Button>
      </div>
      <pre className="whitespace-pre-wrap mt-4 bg-gray-900 text-gray-100 p-4 rounded max-h-[80vh] overflow-auto text-sm">
        {isFetching ? 'Загрузка...' : logs.join('\n')}
      </pre>
    </div>
  );
} 