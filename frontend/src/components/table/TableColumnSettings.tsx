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
    <div className="flex items-center gap-2 ml-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1 items-center">
            <Settings className="h-4 w-4" />
            <span>Настройки</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Управление таблицей</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem
              checked={isReorderingEnabled}
              onCheckedChange={(checked) => onToggleReordering(!!checked)}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Переставление колонок</span>
            </DropdownMenuCheckboxItem>
            
            <DropdownMenuCheckboxItem
              checked={isResizingEnabled}
              onCheckedChange={(checked) => onToggleResizing(!!checked)}
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
          
          <DropdownMenuItem onClick={onResetSettings}>
            <span className="mr-2">↺</span>
            <span>Сбросить настройки</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 