'use client';

import React, { useState } from 'react';
import { 
  useGetPanelsQuery, 
  useDeletePanelMutation,
  useCreatePanelMutation,
  useUpdatePanelMutation,
  // useCheckPanelConnectionManualMutation
} from '@/services/panelsApi';
import { 
  useToggleRelayMutation, 
  usePulseRelayMutation,
  useCreateRelayMutation,
  useDeleteRelayMutation,
  useUpdateRelayMutation
} from '@/services/relaysApi';
import { Panel } from '@/types/panel.types';
import { Relay, RelayType } from '@/types/relay.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Grid, Power, Loader2, Trash2, RefreshCw, Edit, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { BaseTable } from '@/components/table/BaseTable';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
// import { PanelModal } from '@/components/modals/PanelModal';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Отдельный компонент для отображения статуса соединения
function ConnectionCell({ 
  panelId,
  onCheckConnection 
}: { 
  panelId: string;
  onCheckConnection: (id: string) => void 
}) {
  // const [checkStatus, { data: isConnected, isLoading }] = useCheckPanelConnectionManualMutation();

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCheckConnection(panelId);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        // checked={!!isConnected}
        disabled
      />
      <div className="flex items-center space-x-1">
        {/* <Power className={`h-4 w-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} /> */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCheck}
          title="Проверить соединение"
        >
          {/* <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} /> */}
        </Button>
      </div>
    </div>
  );
}

export default function PanelsPage() {
  const { data: panels = [], isLoading, refetch } = useGetPanelsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null);
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  const [expandedView, setExpandedView] = useState(false);
  const [isRelayModalOpen, setIsRelayModalOpen] = useState(false);
  const [editingRelay, setEditingRelay] = useState<Relay | null>(null);
  const [currentPanelId, setCurrentPanelId] = useState<string | null>(null);
  const [relayPage, setRelayPage] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<Record<string, string | undefined>>({});
  const relaysPerPage = 16;

  const [deletePanel] = useDeletePanelMutation();
  const [createPanel] = useCreatePanelMutation();
  const [updatePanel] = useUpdatePanelMutation();
  const [toggleRelay] = useToggleRelayMutation();
  const [pulseRelay] = usePulseRelayMutation();
  const [createRelay] = useCreateRelayMutation();
  const [deleteRelay] = useDeleteRelayMutation();
  const [updateRelay] = useUpdateRelayMutation();
  // const [checkConnection, { data: connectionStatus, isLoading: isConnectionChecking }] = useCheckPanelConnectionManualMutation();

  // Обработчики действий
  const handleEditPanel = (panel: Panel) => {
    setEditingPanel(panel);
    setIsModalOpen(true);
  };

  const handleDeletePanel = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту панель? Это действие нельзя отменить.')) {
      try {
        await deletePanel(id).unwrap();
        toast.success('Панель удалена');
      } catch (error) {
        toast.error('Ошибка при удалении панели');
      }
    }
  };

  const handleCreatePanel = () => {
    setEditingPanel(null);
    setIsModalOpen(true);
  };

  const handleSavePanel = async (data: any) => {
    try {
      if (editingPanel) {
        await updatePanel({ id: editingPanel.id, ...data }).unwrap();
        toast.success('Панель обновлена');
      } else {
        await createPanel(data).unwrap();
        toast.success('Панель создана');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Ошибка при сохранении панели');
    }
  };

  const toggleExpandPanel = (panelId: string) => {
    const isCurrentlyExpanded = expandedPanels.includes(panelId);
    
    setExpandedPanels(prev => 
      isCurrentlyExpanded
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
    
    // Если разворачиваем панель, открываем аккордеон для этой панели
    if (!isCurrentlyExpanded) {
      setOpenAccordion(prev => ({
        ...prev,
        [panelId]: "relays"
      }));
    }
    
    setRelayPage(1); // Сбрасываем страницу при открытии/закрытии панели
  };

  const handleToggleRelay = async (relayId: string, currentState: boolean) => {
    try {
      await toggleRelay({ id: relayId, state: !currentState }).unwrap();
      toast.success('Состояние реле изменено');
    } catch (error) {
      toast.error('Ошибка при изменении состояния реле');
    }
  };

  const handlePulseRelay = async (relayId: string) => {
    try {
      await pulseRelay(relayId).unwrap();
      toast.success('Импульс отправлен');
    } catch (error) {
      toast.error('Ошибка при отправке импульса');
    }
  };

  // Обработчики для редактирования реле
  const handleEditRelay = (relay: Relay) => {
    setEditingRelay(relay);
    setIsRelayModalOpen(true);
  };

  const handleCreateRelay = (panelId: string) => {
    setEditingRelay(null);
    setCurrentPanelId(panelId);
    setIsRelayModalOpen(true);
  };

  const handleSaveRelay = async (data: any) => {
    try {
      if (editingRelay) {
        // Используем метод обновления вместо удаления и создания
        await updateRelay({
          id: editingRelay.id,
          name: data.name,
          relayNumber: data.relayNumber,
          type: data.type
        }).unwrap();
        
        toast.success('Реле обновлено');
      } else if (currentPanelId) {
        // Для создания нового реле
        await createRelay({ 
          name: data.name,
          relayNumber: data.relayNumber,
          type: data.type,
          panelId: currentPanelId
        }).unwrap();
        toast.success('Реле создано');
      }
      
      setIsRelayModalOpen(false);
      setEditingRelay(null);
      setCurrentPanelId(null);
    } catch (error) {
      toast.error('Ошибка при сохранении реле');
      console.error('Ошибка сохранения реле:', error);
    }
  };

  const handleDeleteRelay = async (relayId: string) => {
    if (confirm('Вы уверены, что хотите удалить это реле? Это действие нельзя отменить.')) {
      try {
        await deleteRelay(relayId).unwrap();
        toast.success('Реле удалено');
      } catch (error) {
        toast.error('Ошибка при удалении реле');
      }
    }
  };

  // Получение иконки и цвета для типа реле
  const getRelayTypeInfo = (type: RelayType) => {
    switch (type) {
      case 'SECURITY':
        return { color: 'text-red-500', label: 'Дверь' };
      case 'LIGHT':
        return { color: 'text-yellow-500', label: 'Свет' };
      case 'GATE':
        return { color: 'text-blue-500', label: 'Ворота' };
      default:
        return { color: 'text-gray-500', label: 'Неизвестно' };
    }
  };

  // Проверка соединения для конкретной панели
  const handleCheckConnection = async (panelId: string) => {
    try {
      // const isConnected = await checkConnection(panelId).unwrap();
      // toast.info(isConnected ? 'Соединение установлено' : 'Соединение не установлено');
    } catch (error) {
      toast.error('Ошибка при проверке соединения');
      console.error('Ошибка проверки соединения:', error);
    }
  };

  // Колонки таблицы
  const columns: ColumnDef<Panel>[] = [
    {
      id: 'expand',
      header: () => null,
      cell: ({ row }) => {
        const isExpanded = expandedPanels.includes(row.original.id);
        return (
          <div 
            className="flex items-center justify-center cursor-pointer w-full h-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandPanel(row.original.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP адрес',
    },
    {
      accessorKey: 'port',
      header: 'Порт',
    },
    {
      accessorKey: 'isActive',
      header: 'Статус',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Активна' : 'Неактивна'}
          </Badge>
        );
      },
    },
    {
      id: 'connection',
      header: 'Соединение',
      cell: ({ row }) => {
        const panel = row.original;
        return (
          <ConnectionCell 
            panelId={panel.id}
            onCheckConnection={handleCheckConnection} 
          />
        );
      },
    },
  ];

  // Компонент для редактирования реле
  const RelayModal = () => {
    const [formData, setFormData] = useState({
      name: editingRelay?.name || '',
      relayNumber: editingRelay?.relayNumber || 1,
      type: editingRelay?.type || 'LIGHT' as RelayType,
    });

    const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <Dialog open={isRelayModalOpen} onOpenChange={(open) => !open && setIsRelayModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRelay ? 'Редактировать реле' : 'Добавить реле'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relayName" className="text-right">Название</Label>
              <Input
                id="relayName"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Введите название реле"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relayNumber" className="text-right">Номер реле</Label>
              <Input
                id="relayNumber"
                className="col-span-3"
                type="number"
                min={1}
                max={32}
                value={formData.relayNumber}
                onChange={(e) => handleChange('relayNumber', parseInt(e.target.value))}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relayType" className="text-right">Тип реле</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value as RelayType)}
              >
                <SelectTrigger className="w-full col-span-3">
                  <SelectValue placeholder="Выберите тип реле" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIGHT">Свет</SelectItem>
                  <SelectItem value="SECURITY">Охрана</SelectItem>
                  <SelectItem value="GATE">Ворота/Дверь</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRelayModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={() => handleSaveRelay(formData)}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Компонент для отображения реле панели
  const RelayList = ({ row }: { row: any }) => {
    const panel = row.original;
    
    if (!panel || !panel.relays?.length) {
      return (
        <div className="p-4 text-center">
          <div className="mb-4 text-gray-500 dark:text-gray-400">
            У этой панели нет реле
          </div>
          <Button onClick={() => handleCreateRelay(panel.id)}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить реле
          </Button>
        </div>
      );
    }
    
    // Пагинация для реле
    const totalRelays = panel.relays.length;
    const totalPages = Math.ceil(totalRelays / relaysPerPage);
    const startIndex = (relayPage - 1) * relaysPerPage;
    const endIndex = Math.min(startIndex + relaysPerPage, totalRelays);
    const paginatedRelays = panel.relays.slice(startIndex, endIndex);

    return (
      <div className="p-4">
        <Accordion 
          type="single" 
          collapsible 
          value={openAccordion[panel.id]} 
          onValueChange={(value) => {
            setOpenAccordion(prev => ({
              ...prev,
              [panel.id]: value
            }));
          }}
        >
          <AccordionItem value="relays">
            <AccordionTrigger>
              <div className="flex items-center">
                <span className="font-medium">Реле панели {panel.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {totalRelays}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center mb-4 mt-2">
                <div className="flex items-center">
                  <Button variant="outline" size="sm" onClick={() => handleCreateRelay(panel.id)}>
                    <Plus className="mr-1 h-3 w-3" />
                    Добавить реле
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setExpandedView(!expandedView)}
                    title={expandedView ? "Компактный вид" : "Расширенный вид"}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleCheckConnection(panel.id)}
                    title="Проверить соединение"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className={`grid ${expandedView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4`}>
                {paginatedRelays.map((relay: Relay) => {
                  const typeInfo = getRelayTypeInfo(relay.type);
                  return (
                    <Card key={relay.id} className="relative overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                      <CardHeader className="p-3 pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium truncate" title={relay.name}>
                              {relay.name}
                            </CardTitle>
                            <Badge variant="outline" className={`mt-1 ${typeInfo.color}`}>
                              {typeInfo.label} #{relay.relayNumber}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRelay(relay)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteRelay(relay.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2 w-full justify-center">
                            
                          </div>
                          
                          {expandedView && (
                            <div className="text-center w-full mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <p>Последнее изменение: {new Date(relay.updatedAt).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Пагинация для реле */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setRelayPage(1)}
                      disabled={relayPage === 1}
                    >
                      Первая
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setRelayPage(p => Math.max(1, p - 1))}
                      disabled={relayPage === 1}
                    >
                      Предыдущая
                    </Button>
                    <div className="mx-2 flex items-center">
                      Страница {relayPage} из {totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setRelayPage(p => Math.min(totalPages, p + 1))}
                      disabled={relayPage === totalPages}
                    >
                      Следующая
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setRelayPage(totalPages)}
                      disabled={relayPage === totalPages}
                    >
                      Последняя
                    </Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Панели управления</h2>
          <p className="text-muted-foreground">
            Управление панелями и их реле
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleCreatePanel}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить панель
          </Button>
        </div>
      </div>

      {/* <BaseTable
        data={panels}
        columns={columns}
        searchPlaceholder="Поиск по названию или IP адресу..."
        searchColumn="name"
        enableActions={true}
        onEdit={handleEditPanel}
        onDelete={(panel) => handleDeletePanel(panel.id)}
        renderRowSubComponent={RelayList}
        tableId="panels-table"
        persistColumnOrder={true}
      /> */}

      {/* <PanelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePanel}
        panel={editingPanel}
        title={editingPanel ? 'Редактировать панель' : 'Добавить панель'}
      /> */}
      
      <RelayModal />
    </div>
  );
} 