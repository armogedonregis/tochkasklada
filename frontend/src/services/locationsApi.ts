import { api } from './api';
import { Location, CreateLocationDto, UpdateLocationDto, LocationFilters, PaginatedLocationResponse } from '../types/location.types';


export const locationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<PaginatedLocationResponse, LocationFilters | void>({
      query: (params) => ({
        url: '/locations',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Locations' as const, id })),
              { type: 'Locations', id: 'LIST' },
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocation: builder.query<Location, string>({
      query: (id) => `/locations/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Locations', id: arg }],
    }),
    addLocation: builder.mutation<Location, CreateLocationDto>({
      query: (body) => ({
        url: '/admin/locations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
    updateLocation: builder.mutation<Location, UpdateLocationDto & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/admin/locations/${id}`,
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
        url: `/admin/locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Locations', id },
        { type: 'Locations', id: 'LIST' },
        { type: 'Containers', id: 'LIST' },
        'Cells'
      ],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationQuery,
  useAddLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
  useLazyGetLocationsQuery,
} = locationsApi; 