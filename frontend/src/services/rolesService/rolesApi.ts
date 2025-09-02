import { api } from '../api';
import { Role, CreateRoleDto, UpdateRoleDto, Permission, PermissionsByCategory } from './roles.types';

export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить все роли
    getRoles: builder.query<Role[], void>({
      query: () => 'admin/roles',
      providesTags: ['Roles'],
    }),

    // Получить роль по ID
    getRoleById: builder.query<Role, string>({
      query: (id) => `admin/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Roles', id }],
    }),

    // Создать новую роль
    createRole: builder.mutation<Role, CreateRoleDto>({
      query: (data) => ({
        url: 'admin/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Roles', 'CurrentUser'],
    }),

    // Обновить роль
    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({
        url: `admin/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Roles', id },
        'Roles',
        'CurrentUser', // Обновляем данные пользователя при изменении ролей
      ],
    }),

    // Удалить роль
    deleteRole: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `admin/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Roles', 'CurrentUser'],
    }),

    // Получить все права
    getPermissions: builder.query<Permission[], void>({
      query: () => 'admin/roles/permissions/all',
      providesTags: ['Permissions'],
    }),

    // Получить права по категориям
    getPermissionsByCategory: builder.query<PermissionsByCategory, void>({
      query: () => 'admin/roles/permissions/categories',
      providesTags: ['Permissions'],
    }),

    // Получить права администратора по локациям
    getAdminLocationPermissions: builder.query<any[], string>({
      query: (adminId) => `admin/roles/admin/${adminId}/location-permissions`,
      providesTags: (result, error, adminId) => [{ type: 'Roles', id: `admin-locations-${adminId}` }],
    }),

    // Назначить администратору локации и права
    assignAdminLocations: builder.mutation<{ success: boolean; adminId: string },{ adminId: string; locationIds: string[]; permissions: string[] }>({
      query: (data) => ({
        url: 'admin/roles/assign-admin-locations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Roles', id: `admin-locations-${arg.adminId}` },
        'Roles',
      ],
    }),

    // Доступные локации текущего админа
    getMyLocations: builder.query<{ data: any[] }, void>({
      query: () => 'admin/roles/me/locations',
      providesTags: ['Roles'],
    }),

    // Срез по конкретной локации для текущего админа
    getMyLocationSnapshot: builder.query<{ data: any }, string>({
      query: (locationId) => `admin/roles/me/location/${locationId}/snapshot`,
      providesTags: (result, error, locationId) => [{ type: 'Roles', id: `snapshot-${locationId}` }],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useGetPermissionsByCategoryQuery,
  useGetAdminLocationPermissionsQuery,
  useAssignAdminLocationsMutation,
  useGetMyLocationsQuery,
  useGetMyLocationSnapshotQuery,
} = rolesApi;
