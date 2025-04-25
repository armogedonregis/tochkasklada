import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    credentials: 'include',
    baseUrl: 'http://localhost:5000/api'
  }),
  tagTypes: ['Panel', 'User'],
  endpoints: () => ({}),
});