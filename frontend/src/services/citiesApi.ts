import { api } from './api';

export interface City {
  id: string;
  title: string;
  short_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCityDto {
  title: string;
  short_name: string;
}

export interface UpdateCityDto {
  title?: string;
  short_name?: string;
}

export const citiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => '/cities',
      providesTags: ['Cities'],
    }),
    getCity: builder.query<City, string>({
      query: (id) => `/cities/${id}`,
      providesTags: ['Cities'],
    }),
    addCity: builder.mutation<City, CreateCityDto>({
      query: (city) => ({
        url: '/cities',
        method: 'POST',
        body: city,
      }),
      invalidatesTags: ['Cities'],
    }),
    updateCity: builder.mutation<City, UpdateCityDto & { id: string }>({
      query: (city) => {
        const { id, ...body } = city;
        return {
          url: `/cities/${id}`,
          method: 'PUT',
          body: body,
        };
      },
      invalidatesTags: ['Cities'],
    }),
    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cities'],
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