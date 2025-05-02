import { api } from './api';
import { City } from './citiesApi';

export interface Location {
  id: string;
  name: string;
  short_name: string;
  address: string;
  cityId: string;
  createdAt?: string;
  updatedAt?: string;
  city?: City;
}

export interface CreateLocationDto {
  name: string;
  short_name: string;
  address: string;
  cityId: string;
}

export interface UpdateLocationDto {
  name?: string;
  short_name?: string;
  address?: string;
  cityId?: string;
}

export const locationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => '/locations',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocation: builder.query<Location, string>({
      query: (id) => `/locations/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Locations', id: result?.id }],
    }),
    getLocationsByCity: builder.query<Location[], string>({
      query: (cityId) => `/locations/city/${cityId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocationByShortName: builder.query<Location, string>({
      query: (shortName) => `/locations/short-name/${shortName}`,
      providesTags: (result, error, arg) => [{ type: 'Locations', id: result?.id }],
    }),
    addLocation: builder.mutation<Location, CreateLocationDto>({
      query: (body) => ({
        url: '/locations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
    updateLocation: builder.mutation<Location, UpdateLocationDto & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/locations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Locations', id: arg.id },
        { type: 'Locations', id: 'LIST' },
      ],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationQuery,
  useGetLocationsByCityQuery,
  useGetLocationByShortNameQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi; 