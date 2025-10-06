import { api } from '../api';
import { AdminProfile } from './admin.types';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => ({
        url: '/admins/profile',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
    createAdminProfile: builder.mutation<AdminProfile, void>({
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
