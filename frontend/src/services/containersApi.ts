import { api } from './api';

export interface Container {
  id: number;
  locId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для создания контейнера
export interface CreateContainerDto {
  id: number;
  locId?: string;
}

export interface UpdateContainerDto {
  locId?: string;
}

export const containersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContainers: builder.query<Container[], void>({
      query: () => '/containers',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Containers' as const, id })),
              { type: 'Containers', id: 'LIST' },
            ]
          : [{ type: 'Containers', id: 'LIST' }],
    }),
    getContainer: builder.query<Container, number>({
      query: (id) => `/containers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Containers', id }],
    }),
    getContainersByLocation: builder.query<Container[], string>({
      query: (locId) => `/containers/location/${locId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Containers' as const, id })),
              { type: 'Containers', id: 'LIST' },
            ]
          : [{ type: 'Containers', id: 'LIST' }],
    }),
    addContainer: builder.mutation<Container, CreateContainerDto>({
      query: (container) => ({
        url: '/containers',
        method: 'POST',
        body: container,
      }),
      invalidatesTags: [{ type: 'Containers', id: 'LIST' }],
    }),
    updateContainer: builder.mutation<Container, UpdateContainerDto & { id: number }>({
      query: (container) => {
        const { id, ...body } = container;
        return {
          url: `/containers/${id}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Containers', id },
        { type: 'Containers', id: 'LIST' },
      ],
    }),
    deleteContainer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/containers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Containers', id },
        { type: 'Containers', id: 'LIST' },
        'Cells'
      ],
    }),
  }),
});

export const {
  useGetContainersQuery,
  useGetContainerQuery,
  useGetContainersByLocationQuery,
  useAddContainerMutation,
  useUpdateContainerMutation,
  useDeleteContainerMutation,
} = containersApi;
