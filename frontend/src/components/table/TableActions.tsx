'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { PermissionGate } from '@/services/authService';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editPermission?: string;
  deletePermission?: string;
}

export const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  editPermission,
  deletePermission
}) => {
  return (
    <div className="flex gap-2 table-actions">
      <PermissionGate permissions={editPermission ? [editPermission] : []}>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Редактировать"
          className="min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px] touch-manipulation"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </PermissionGate>
      <PermissionGate permissions={deletePermission ? [deletePermission] : []}>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить"
          className="min-w-[44px] min-h-[44px] sm:min-w-[32px] sm:min-h-[32px] touch-manipulation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </PermissionGate>
    </div>
  );
}; 