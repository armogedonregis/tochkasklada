import { api } from './api';

export interface Container {
  id: number;
  locId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для создания контейнера (с id)
export interface CreateContainerRequest {
  id: number;
  locId: string;
}

export const containersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContainers: builder.query<Container[], void>({
      query: () => '/container',
      providesTags: ['Containers'],
    }),
    getContainersByLocation: builder.query<Container[], string>({
      query: (locId) => `/container/by-location/${locId}`,
      providesTags: ['Containers'],
    }),
    addContainer: builder.mutation<Container, CreateContainerRequest>({
      query: (container) => ({
        url: '/container',
        method: 'POST',
        body: container,
      }),
      invalidatesTags: ['Containers'],
    }),
    updateContainer: builder.mutation<Container, Partial<Container> & { id: number }>({
      query: (container) => ({
        url: `/container/${container.id}`,
        method: 'PUT',
        body: container,
      }),
      invalidatesTags: ['Containers'],
    }),
    deleteContainer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/container/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Containers'],
    }),
  }),
});

export const {
  useGetContainersQuery,
  useGetContainersByLocationQuery,
  useAddContainerMutation,
  useUpdateContainerMutation,
  useDeleteContainerMutation,
} = containersApi;
