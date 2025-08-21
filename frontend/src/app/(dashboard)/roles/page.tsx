"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/services/rolesService/rolesApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal";
import { PermissionGate } from "@/services/authService";

export default function RolesPage() {
  const router = useRouter();
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  
  const { data: roles = [], isLoading, refetch } = useGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId).unwrap();
      toast.success('Роль успешно удалена');
      setRoleToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Ошибка при удалении роли');
    }
  };

  const getPermissionCount = (role: any) => {
    return role.rolePermissions?.length || 0;
  };

  const getAdminCount = (role: any) => {
    return role._count?.adminRoles || 0;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Загрузка ролей...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Управление ролями</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Создавайте и настраивайте роли для управления доступом пользователей к различным функциям системы
          </p>
        </div>
        <PermissionGate permissions={['roles:create']}>
          <Button onClick={() => router.push('/roles/create')} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Создать роль
          </Button>
        </PermissionGate>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card 
            key={role.id} 
            className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
            onClick={() => router.push(`/roles/${role.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {role.name}
                </CardTitle>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PermissionGate permissions={['roles:update']}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/roles/${role.id}`);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate permissions={['roles:delete']}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleToDelete(role.id);
                      }}
                      disabled={getAdminCount(role) > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </PermissionGate>
                </div>
              </div>
              {role.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {role.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-3 py-1">
                    {getPermissionCount(role)} прав
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    {getAdminCount(role)} админов
                  </Badge>
                </div>
                
                {role.rolePermissions && role.rolePermissions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Права доступа:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.rolePermissions.slice(0, 4).map((rp) => (
                        <Badge 
                          key={rp.permission.id} 
                          variant="outline" 
                          className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          {rp.permission.description || rp.permission.key}
                        </Badge>
                      ))}
                      {role.rolePermissions.length > 4 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                        >
                          +{role.rolePermissions.length - 4} еще
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Роли еще не созданы
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Создайте первую роль для управления доступом пользователей к различным функциям системы
            </p>
            <Button onClick={() => router.push('/roles/create')} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Создать первую роль
            </Button>
          </CardContent>
        </Card>
      )}

      <ConfirmDeleteModal
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={() => roleToDelete && handleDeleteRole(roleToDelete)}
        title="Удалить роль"
      />
    </div>
  );
}
