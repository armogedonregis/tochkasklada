import { api } from './api';
import { RelayAccess, CreateRelayAccessRequest, UpdateRelayAccessRequest } from '../types/relay-access.types';

export const relayAccessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка доступов
    getRelayAccesses: builder.query<RelayAccess[], void>({
      query: () => ({
        url: '/relay-access',
        method: 'GET',
      }),
      providesTags: ['RelayAccess'],
    }),
    
    // Получение доступов пользователя
    getUserRelayAccesses: builder.query<RelayAccess[], string>({
      query: (userId) => ({
        url: `/relay-access/user/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'RelayAccess', id: userId }],
    }),
    
    // Выдача доступа
    grantAccess: builder.mutation<RelayAccess, CreateRelayAccessRequest>({
      query: (access) => ({
        url: '/relay-access',
        method: 'POST',
        body: access,
      }),
      invalidatesTags: ['RelayAccess'],
    }),
    
    // Проверка доступа
    checkAccess: builder.mutation<boolean, { userId: string; relayId: string }>({
      query: (data) => ({
        url: '/relay-access/check',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Отзыв доступа
    revokeAccess: builder.mutation<void, string>({
      query: (id) => ({
        url: `/relay-access/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RelayAccess'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRelayAccessesQuery,
  useGetUserRelayAccessesQuery,
  useGrantAccessMutation,
  useCheckAccessMutation,
  useRevokeAccessMutation,
} = relayAccessApi; 