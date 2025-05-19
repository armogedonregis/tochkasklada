import { api } from './api';
import { Size, CreateSizeDto, UpdateSizeDto } from '../types/size.types';

export const sizesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query<Size[], void>({
      query: () => '/sizes',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Sizes' as const, id })),
              { type: 'Sizes' as const, id: 'LIST' },
            ]
          : [{ type: 'Sizes' as const, id: 'LIST' }],
    }),

    getSize: builder.query<Size, string>({
      query: (id) => `/sizes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Sizes', id }],
    }),

    addSize: builder.mutation<Size, CreateSizeDto>({
      query: (size) => ({
        url: '/sizes',
        method: 'POST',
        body: size,
      }),
      invalidatesTags: [{ type: 'Sizes' as const, id: 'LIST' }],
    }),

    updateSize: builder.mutation<Size, UpdateSizeDto & { id: string }>({
      query: ({ id, ...size }) => ({
        url: `/sizes/${id}`,
        method: 'PATCH',
        body: size,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Sizes', id },
        { type: 'Sizes', id: 'LIST' },
      ],
    }),

    deleteSize: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Sizes' as const, id },
        { type: 'Sizes' as const, id: 'LIST' },
        'Cells' as const
      ],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useGetSizeQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = sizesApi; 