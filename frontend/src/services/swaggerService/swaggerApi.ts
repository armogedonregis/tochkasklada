import { api } from '../api';


// Расширение базового API для получения Swagger документации
export const swaggerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение JSON документации Swagger
    getSwaggerJson: builder.query<void, void>({
      query: () => ({
        url: '/swagger/json',
        method: 'GET',
      }),
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetSwaggerJsonQuery,
  useLazyGetSwaggerJsonQuery
} = swaggerApi; 