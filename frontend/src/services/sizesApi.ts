import { api } from './api';

export interface Size {
  id: string;
  name: string;
  size: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddSizeRequest {
  name: string;
  size: string;
  area: string;
}

export interface UpdateSizeRequest {
  id: string;
  name: string;
  size: string;
  area: string;
}

export const sizesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query<Size[], void>({
      query: () => '/size',
      providesTags: ['Sizes'],
    }),

    getSize: builder.query<Size, string>({
      query: (id) => `/size/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Sizes', id }],
    }),

    addSize: builder.mutation<Size, AddSizeRequest>({
      query: (size) => ({
        url: '/size',
        method: 'POST',
        body: size,
      }),
      invalidatesTags: ['Sizes'],
    }),

    updateSize: builder.mutation<Size, UpdateSizeRequest>({
      query: ({ id, ...size }) => ({
        url: `/size/${id}`,
        method: 'PUT',
        body: size,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Sizes', id },
        'Sizes',
      ],
    }),

    deleteSize: builder.mutation<void, string>({
      query: (id) => ({
        url: `/size/${id}`,
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