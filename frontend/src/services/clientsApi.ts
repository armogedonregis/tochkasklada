import { api } from './api';

export interface Phone {
  id: string;
  number: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  company: string;
  createdAt: string;
  updatedAt: string;
  phones: Phone[];
}

export interface CreateClientRequest {
  name: string;
  email: string;
  company?: string;
  phones?: string[];
}

export interface UpdateClientRequest {
  id: string;
  name?: string;
  email?: string;
  company?: string;
  phones?: string[];
}

// Расширение базового API для работы с клиентами
export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка клиентов
    getClients: builder.query<Client[], void>({
      query: () => ({
        url: '/clients',
        method: 'GET',
      }),
      providesTags: ['Clients'],
    }),
    
    // Получение клиента по ID
    getClientById: builder.query<Client, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Clients', id }],
    }),
    
    // Создание клиента
    createClient: builder.mutation<Client, CreateClientRequest>({
      query: (client) => ({
        url: '/clients',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: ['Clients'],
    }),
    
    // Обновление клиента
    updateClient: builder.mutation<Client, UpdateClientRequest>({
      query: ({ id, ...patch }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Clients', id },
        'Clients',
      ],
    }),
    
    // Удаление клиента
    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi; 