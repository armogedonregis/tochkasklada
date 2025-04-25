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

export const locationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => '/location',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocationsByCity: builder.query<Location[], string>({
      query: (cityId) => `/location/by-city/${cityId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocationByShortName: builder.query<Location, string>({
      query: (shortName) => `/location/short-name/${shortName}`,
      providesTags: (result, error, arg) => [{ type: 'Locations', id: result?.id }],
    }),
    addLocation: builder.mutation<
      Location,
      { name: string; short_name: string; address: string; cityId: string }
    >({
      query: (body) => ({
        url: '/location',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
    updateLocation: builder.mutation<
      Location,
      { id: string; name: string; short_name: string; address: string; cityId: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/location/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Locations', id: arg.id },
        { type: 'Locations', id: 'LIST' },
      ],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/location/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationsByCityQuery,
  useGetLocationByShortNameQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi; 