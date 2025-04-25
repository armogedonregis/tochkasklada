import { api } from './api';

export interface City {
  id: string;
  title: string;
  short_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const citiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => '/city',
      providesTags: ['Cities'],
    }),
    addCity: builder.mutation<City, Omit<City, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (city) => ({
        url: '/city',
        method: 'POST',
        body: city,
      }),
      invalidatesTags: ['Cities'],
    }),
    updateCity: builder.mutation<City, Partial<City> & { id: string }>({
      query: (city) => ({
        url: `/city/${city.id}`,
        method: 'PUT',
        body: city,
      }),
      invalidatesTags: ['Cities'],
    }),
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/city/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cities'],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = citiesApi;