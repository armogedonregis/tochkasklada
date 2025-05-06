import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Помощник для управления токенами
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Базовая конфигурация API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState, type }) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  tagTypes: [
    'Cities',
    'Locations',
    'Containers',
    'Cells',
    'Sizes',
    'User',
    'Auth',
    'Clients',
    'Payments',
    'CellStatuses',
    'Panels',
    'Relays',
    'RelayAccess',
  ],
  endpoints: () => ({}),
}); 