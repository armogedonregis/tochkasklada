import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Базовая конфигурация API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Cities', 'Locations', 'Containers', 'Cells', 'Sizes'],
  endpoints: () => ({}),
}); 