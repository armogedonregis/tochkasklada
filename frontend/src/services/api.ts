import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagTypes } from './tagTypes';

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Базовая конфигурация API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState, type }) => {
      const token = getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    }
  }),
  tagTypes: tagTypes,
  endpoints: () => ({}),
}); 