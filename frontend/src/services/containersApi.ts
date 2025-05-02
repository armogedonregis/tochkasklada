import { api } from './api';

export interface Container {
  id: number;
  locId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для создания контейнера
export interface CreateContainerDto {
  id: number;
  locId: string;
}

export interface UpdateContainerDto {
  locId?: string;
}

export const containersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContainers: builder.query<Container[], void>({
      query: () => '/containers',
      providesTags: ['Containers'],
    }),
    getContainer: builder.query<Container, number>({
      query: (id) => `/containers/${id}`,
      providesTags: ['Containers'],
    }),
    getContainersByLocation: builder.query<Container[], string>({
      query: (locId) => `/containers/location/${locId}`,
      providesTags: ['Containers'],
    }),
    addContainer: builder.mutation<Container, CreateContainerDto>({
      query: (container) => ({
        url: '/containers',
        method: 'POST',
        body: container,
      }),
      invalidatesTags: ['Containers'],
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
      invalidatesTags: ['Containers'],
    }),
    deleteContainer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/containers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Containers'],
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
