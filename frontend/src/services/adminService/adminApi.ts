import { api } from '../api';
import { AdminProfile, CreateAdminProfileDto } from './admin.types';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение профиля администратора по ID пользователя
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => ({
        url: '/admins/profile',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    // Создание профиля администратора
    createAdminProfile: builder.mutation<AdminProfile, CreateAdminProfileDto>({
      query: (data) => ({
        url: '/admins/profile',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useLazyGetAdminProfileQuery,
  useCreateAdminProfileMutation,
} = adminApi;
