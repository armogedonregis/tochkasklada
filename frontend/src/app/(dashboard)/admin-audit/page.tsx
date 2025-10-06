'use client';

import { useState, useEffect, useMemo } from 'react';
import { useGetAuditLogsQuery, useGetAuditStatsQuery } from '@/services/adminAuditService/adminAuditApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon } from 'lucide-react';

const ENTITY_OPTIONS = [
  { value: 'all', label: 'Все сущности' },
  { value: 'cells', label: 'Ячейки' },
  { value: 'clients', label: 'Клиенты' },
  { value: 'locations', label: 'Локации' },
  { value: 'containers', label: 'Контейнеры' },
  { value: 'sizes', label: 'Размеры' },
  { value: 'rentals', label: 'Аренды' },
  { value: 'admins', label: 'Админы' },
  { value: 'roles', label: 'Роли' },
  { value: 'users', label: 'Пользователи' },
];

const ACTION_OPTIONS = [
  { value: 'all', label: 'Все действия' },
  { value: 'CREATE', label: 'Создание' },
  { value: 'UPDATE', label: 'Обновление' },
  { value: 'DELETE', label: 'Удаление' },
  { value: 'SOFT_DELETE', label: 'Мягкое удаление' },
  { value: 'RESTORE', label: 'Восстановление' },
  { value: 'ASSIGN_ROLE', label: 'Назначение роли' },
  { value: 'REVOKE_ROLE', label: 'Отзыв роли' },
  { value: 'ASSIGN_RESOURCE_ACCESS', label: 'Назначение доступа' },
  { value: 'REVOKE_RESOURCE_ACCESS', label: 'Отзыв доступа' },
  { value: 'OTHER', label: 'Другое' },
];

export default function AdminAuditPage() {
  const [filters, setFilters] = useState({
    entity: 'all',
    action: 'all',
    adminId: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: auditLogs, isLoading: isLogsLoading, refetch } = useGetAuditLogsQuery({
    ...filters,
    entity: filters.entity === 'all' ? '' : filters.entity,
    action: filters.action === 'all' ? '' : filters.action,
  });
  
  const { data: auditStats, isLoading: isStatsLoading } = useGetAuditStatsQuery({
    adminId: filters.adminId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  });

  // Фильтруем логи по поисковому запросу
  const filteredLogs = useMemo(() => {
    if (!auditLogs?.data) return [];
    
    return auditLogs.data.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.entity.toLowerCase().includes(searchLower) ||
        log.entityId.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.admin?.user?.email || '').toLowerCase().includes(searchLower) ||
        (log.ip || '').toLowerCase().includes(searchLower)
      );
    });
  }, [auditLogs?.data, searchTerm]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500';
      case 'UPDATE': return 'bg-blue-500';
      case 'DELETE': return 'bg-red-500';
      case 'SOFT_DELETE': return 'bg-orange-500';
      case 'RESTORE': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionLabel = (action: string) => {
    const option = ACTION_OPTIONS.find(opt => opt.value === action);
    return option?.label || action;
  };

  const getEntityLabel = (entity: string) => {
    const option = ENTITY_OPTIONS.find(opt => opt.value === entity);
    return option?.label || entity;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('ru-RU');
    } catch {
      return timestamp;
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow">
      {/* Заголовок */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Аудит действий админов</h1>
          <Button 
            onClick={() => refetch()} 
            disabled={isLogsLoading}
            variant="outline"
            size="sm"
          >
            {isLogsLoading ? 'Загрузка...' : 'Обновить'}
          </Button>
        </div>

        {/* Фильтры */}
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Сущность" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Действие" />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[200px]"
          />

          <div className="text-sm text-gray-500 ml-auto">
            {filteredLogs.length} из {auditLogs?.meta?.totalCount || 0} записей
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="p-4">
        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs">Логи действий</TabsTrigger>
            <TabsTrigger value="stats">Статистика</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4">
            {isLogsLoading ? (
              <div className="text-center py-8 text-gray-500">Загрузка логов...</div>
            ) : !auditLogs?.data || auditLogs.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Нет логов для отображения</div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Badge className={`${getActionColor(log.action)} text-white text-xs flex-shrink-0`}>
                        {getActionLabel(log.action)}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getEntityLabel(log.entity)}
                            </Badge>
                            <span className="text-sm text-gray-600">ID: {log.entityId}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-mono">
                            {formatTimestamp(log.createdAt)}
                          </span>
                        </div>
                        
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium">Админ:</span>{' '}
                            {log.admin?.user?.email || 'Неизвестен'}
                          </div>
                          {log.ip && (
                            <div className="mb-1">
                              <span className="font-medium">IP:</span> {log.ip}
                            </div>
                          )}
                          {log.requestId && (
                            <div className="mb-1">
                              <span className="font-medium">Request ID:</span> {log.requestId}
                            </div>
                          )}
                        </div>

                        {/* Данные до и после изменения */}
                        {(log.before || log.after) && (
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {log.before && (
                              <div>
                                <div className="text-xs font-medium text-gray-600 mb-1">До изменения:</div>
                                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(log.before, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.after && (
                              <div>
                                <div className="text-xs font-medium text-gray-600 mb-1">После изменения:</div>
                                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(log.after, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Пагинация */}
            {auditLogs?.meta && auditLogs.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  Назад
                </Button>
                <span className="text-sm text-gray-600">
                  Страница {filters.page} из {auditLogs.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= auditLogs.meta.totalPages}
                >
                  Вперед
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            {isStatsLoading ? (
              <div className="text-center py-8 text-gray-500">Загрузка статистики...</div>
            ) : auditStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Всего действий</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditStats.totalActions}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">По типам действий</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {auditStats.actionsByType?.map((item) => (
                        <div key={item.action} className="flex justify-between items-center">
                          <span className="text-sm">{getActionLabel(item.action)}</span>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">По сущностям</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {auditStats.actionsByEntity?.map((item) => (
                        <div key={item.entity} className="flex justify-between items-center">
                          <span className="text-sm">{getEntityLabel(item.entity)}</span>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Нет данных для отображения</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
