import { api } from './api';
import { City, CreateCityDto, UpdateCityDto, CityFilters, PaginatedCityResponse } from '../types/city.types';

export const citiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<PaginatedCityResponse, CityFilters | void>({
      query: (params) => ({
        url: '/cities',
        params: params || undefined
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Cities' as const, id })),
              { type: 'Cities', id: 'LIST' },
            ]
          : [{ type: 'Cities', id: 'LIST' }],
    }),
    getCity: builder.query<City, string>({
      query: (id) => `/cities/${id}`,
      providesTags: (result, error, id) => [{ type: 'Cities', id }],
    }),
    addCity: builder.mutation<City, CreateCityDto>({
      query: (city) => ({
        url: '/admin/cities',
        method: 'POST',
        body: city,
      }),
      invalidatesTags: ['Cities'],
    }),
    updateCity: builder.mutation<City, UpdateCityDto & { id: string }>({
      query: (city) => {
        const { id, ...body } = city;
        return {
          url: `/admin/cities/${id}`,
          method: 'PUT',
          body: body,
        };
      },
      invalidatesTags: ['Cities'],
    }),
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cities', id },
        { type: 'Cities', id: 'LIST' },
        { type: 'Locations', id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetCityQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
} = citiesApi;