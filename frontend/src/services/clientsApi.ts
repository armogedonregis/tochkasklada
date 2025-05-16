import { api } from './api';
import { 
  Client, 
  ClientPhone,
  CreateClientDto, 
  UpdateClientDto, 
  ClientFilters,
  PaginatedClientResponse
} from '../types/client.types';


// Расширение базового API для работы с клиентами
export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка клиентов с фильтрацией
    getClients: builder.query<PaginatedClientResponse, ClientFilters | void>({
      query: (params) => ({
        url: '/clients',
        params: params || undefined
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Clients' as const, id })),
              { type: 'Clients', id: 'LIST' },
            ]
          : [{ type: 'Clients', id: 'LIST' }],
    }),
    
    // Получение клиента по ID
    getClientById: builder.query<Client, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Clients', id }],
    }),
    
    // Создание клиента
    createClient: builder.mutation<Client, CreateClientDto>({
      query: (client) => ({
        url: '/clients',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [{ type: 'Clients', id: 'LIST' }],
    }),
    
    // Добавление телефона клиенту
    addPhone: builder.mutation<ClientPhone, { clientId: string, phone: string }>({
      query: ({ clientId, phone }) => ({
        url: `/clients/${clientId}/phones`,
        method: 'POST',
        body: { phone },
      }),
      invalidatesTags: (result, error, { clientId }) => [{ type: 'Clients', id: clientId }],
    }),
    
    // Удаление телефона клиента
    removePhone: builder.mutation<string, string>({
      query: (phoneId) => ({
        url: `/clients/phones/${phoneId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
    
    // Обновление клиента
    updateClient: builder.mutation<Client, UpdateClientDto & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Clients', id },
        { type: 'Clients', id: 'LIST' },
      ],
    }),
    
    // Удаление клиента
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Clients', id },
        { type: 'Clients', id: 'LIST' },
        'Payments'
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useAddPhoneMutation,
  useRemovePhoneMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi; 