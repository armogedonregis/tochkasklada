import { api } from './api';

// Типы для различных форматов телефонов, которые могут приходить с сервера
export interface PhoneWithNumber {
  id: string;
  number: string;
}

export interface PhoneWithPhoneField {
  id: string;
  phone: string;
}

// Объединенный тип для телефона
export type Phone = PhoneWithNumber | PhoneWithPhoneField | string;

export interface Client {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  phones: Phone[];
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phones?: string[];
}

export interface UpdateClientRequest {
  id: string;
  name?: string;
  email?: string;
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
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Clients' as const, id })),
              { type: 'Clients', id: 'LIST' },
            ]
          : [{ type: 'Clients', id: 'LIST' }],
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
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi; 