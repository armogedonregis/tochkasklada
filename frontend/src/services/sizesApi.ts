import { api } from './api';

export interface Size {
  id: string;
  name: string;
  size: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSizeDto {
  name: string;
  size: string;
  area: string;
}

export interface UpdateSizeDto {
  name?: string;
  size?: string;
  area?: string;
}

export const sizesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query<Size[], void>({
      query: () => '/sizes',
      providesTags: ['Sizes'],
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
      invalidatesTags: ['Sizes'],
    }),

    updateSize: builder.mutation<Size, UpdateSizeDto & { id: string }>({
      query: ({ id, ...size }) => ({
        url: `/sizes/${id}`,
        method: 'PATCH',
        body: size,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Sizes', id },
        'Sizes',
      ],
    }),

    deleteSize: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sizes'],
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