import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store/store';

// Помощник для управления токенами
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Базовая конфигурация API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      
      // Добавляем токен, если он есть в локальном хранилище
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  tagTypes: ['Cities', 'Locations', 'Containers', 'Cells', 'Sizes', 'User', 'Auth', 'Clients', 'Payments', 'CellStatuses'],
  endpoints: () => ({}),
}); 