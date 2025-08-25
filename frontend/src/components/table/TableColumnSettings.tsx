import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Eye, EyeOff, ArrowUpDown, Move } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Тип для колонки с минимальной информацией для настроек
interface ColumnInfo {
  id: string;
  title: string;
  isVisible: boolean;
  canHide: boolean;
  toggleVisibility: (value: boolean) => void;
}

interface TableColumnSettingsProps {
  columns: ColumnInfo[];
  isReorderingEnabled: boolean;
  isResizingEnabled: boolean;
  onToggleReordering: (enabled: boolean) => void;
  onToggleResizing: (enabled: boolean) => void;
  onResetSettings: () => void;
}

export function TableColumnSettings({ 
  columns, 
  isReorderingEnabled = false,
  isResizingEnabled = false,
  onToggleReordering,
  onToggleResizing,
  onResetSettings,
}: TableColumnSettingsProps) {
  const visibleColumns = columns.filter(col => col.canHide && col.id !== 'actions');

  if (visibleColumns.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 sm:ml-4 w-full sm:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1 items-center w-full sm:w-auto min-h-[44px] sm:min-h-[32px] touch-manipulation">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Настройки</span>
            <span className="sm:hidden">Настройки таблицы</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 sm:w-56">
          <DropdownMenuLabel>Управление таблицей</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem
              checked={isReorderingEnabled}
              onCheckedChange={(checked) => onToggleReordering(!!checked)}
              className="min-h-[44px] sm:min-h-[32px]"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Переставление колонок</span>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={isResizingEnabled}
              onCheckedChange={(checked) => onToggleResizing(!!checked)}
              className="min-h-[44px] sm:min-h-[32px]"
            >
              <Move className="mr-2 h-4 w-4" />
              <span>Изменение размера колонок</span>
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Видимость колонок</DropdownMenuLabel>
          {visibleColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.isVisible}
              onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
              className="min-h-[44px] sm:min-h-[32px]"
            >
              {column.isVisible ? (
                <Eye className="mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {column.title}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onResetSettings} className="min-h-[44px] sm:min-h-[32px]">
            <span className="mr-2">↺</span>
            <span>Сбросить настройки</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 