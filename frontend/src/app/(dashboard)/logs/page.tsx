'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetLogsQuery, useGetLogFilesQuery } from '@/services/logsService/logsApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  service?: string;
}

export default function LogsPage() {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [fileType, setFileType] = useState<string>('combined');

  const { data: logFiles = [], isLoading: isFilesLoading } = useGetLogFilesQuery();
  const {
    data: logs = [],
    refetch,
    isFetching,
  } = useGetLogsQuery({ file: selectedFile, lines: 500 }, { skip: !selectedFile });

  // Группируем файлы по типу
  const groupedFiles = useMemo(() => {
    const combined = logFiles.filter(f => f.includes('combined'));
    const error = logFiles.filter(f => f.includes('error'));
    return { combined, error };
  }, [logFiles]);

  // Парсим JSON логи
  const parsedLogs = useMemo(() => {
    return logs.map((log, index) => {
      try {
        const parsed = JSON.parse(log) as LogEntry;
        return { ...parsed, originalIndex: index };
      } catch {
        return {
          timestamp: new Date().toISOString(),
          level: 'unknown',
          message: log,
          originalIndex: index,
        };
      }
    });
  }, [logs]);

  // Фильтруем логи
  const filteredLogs = useMemo(() => {
    return parsedLogs.filter(log => {
      const matchesSearch = !searchTerm || 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [parsedLogs, searchTerm, levelFilter]);

  // Выбираем первый файл по умолчанию при смене типа
  useEffect(() => {
    const currentFiles = fileType === 'combined' ? groupedFiles.combined : groupedFiles.error;
    if (currentFiles.length > 0 && !currentFiles.includes(selectedFile)) {
      setSelectedFile(currentFiles[0]);
    }
  }, [fileType, groupedFiles, selectedFile]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warn': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      case 'debug': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ru-RU');
  };

  const currentFiles = fileType === 'combined' ? groupedFiles.combined : groupedFiles.error;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Заголовок и контролы */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Логи сервера</h1>
          <Button 
            onClick={() => refetch()} 
            disabled={isFetching || !selectedFile}
            variant="outline"
            size="sm"
          >
            {isFetching ? 'Загрузка...' : 'Обновить'}
          </Button>
        </div>

        {/* Фильтры в одну строку */}
        <div className="flex gap-4 items-center">
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Combined</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedFile} onValueChange={setSelectedFile}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите файл" />
            </SelectTrigger>
            <SelectContent>
              {currentFiles.map((file) => (
                <SelectItem key={file} value={file}>
                  {file.replace(`${fileType}-`, '').replace('.log', '')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warn">Warn</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Поиск по сообщению..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />

          <div className="text-sm text-gray-500 ml-auto">
            {filteredLogs.length} из {parsedLogs.length} записей
          </div>
        </div>
      </div>

      {/* Логи */}
      <div className="p-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {isFetching ? 'Загрузка...' : 'Нет логов для отображения'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, index) => (
              <Card key={log.originalIndex} className="p-3">
                <div className="flex items-start gap-3">
                  <Badge className={`${getLevelColor(log.level)} text-white text-xs flex-shrink-0`}>
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-gray-500 font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      {log.context && (
                        <Badge variant="outline" className="text-xs">
                          {log.context}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-mono break-words text-gray-900 dark:text-gray-100">
                      {log.message}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}