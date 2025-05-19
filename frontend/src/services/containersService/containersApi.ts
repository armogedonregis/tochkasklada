import { api } from '../api';
import { 
  Container, 
  CreateContainerDto, 
  UpdateContainerDto, 
  ContainerFilters,
  PaginatedContainerResponse
} from './container.types';

export const containersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getContainers: builder.query<PaginatedContainerResponse, ContainerFilters | void>({
      query: (params) => ({
        url: '/admin/containers',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Containers' as const, id })),
            { type: 'Containers', id: 'LIST' },
          ]
          : [{ type: 'Containers', id: 'LIST' }],
    }),

    getContainer: builder.query<Container, string>({
      query: (id) => `/admin/containers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Containers', id }],
    }),

    addContainer: builder.mutation<Container, CreateContainerDto>({
      query: (container) => ({
        url: '/admin/containers',
        method: 'POST',
        body: container,
      }),
      invalidatesTags: [{ type: 'Containers', id: 'LIST' }, 'Cells'],
    }),
    updateContainer: builder.mutation<Container, UpdateContainerDto & { id: string }>({
      query: (container) => {
        const { id, ...body } = container;
        return {
          url: `/admin/containers/${id}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Containers', id },
        { type: 'Containers', id: 'LIST' },
      ],
    }),
    deleteContainer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/containers/${id}`,
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
  useAddContainerMutation, 
  useUpdateContainerMutation, 
  useDeleteContainerMutation 
} = containersApi;
