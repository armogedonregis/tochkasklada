'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const TableActions: React.FC<TableActionsProps> = ({ 
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        title="Редактировать"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Удалить"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}; 