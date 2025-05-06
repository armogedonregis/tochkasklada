import { api } from './api';
import { Relay, CreateRelayRequest, UpdateRelayRequest } from '../types/relay.types';

export const relaysApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка реле
    getRelays: builder.query<Relay[], void>({
      query: () => ({
        url: '/relays',
        method: 'GET',
      }),
      providesTags: ['Relays'],
    }),
    
    // Получение реле по ID
    getRelayById: builder.query<Relay, string>({
      query: (id) => ({
        url: `/relays/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Relays', id }],
    }),
    
    // Создание реле
    createRelay: builder.mutation<Relay, CreateRelayRequest>({
      query: (relay) => ({
        url: '/relays',
        method: 'POST',
        body: relay,
      }),
      invalidatesTags: ['Relays'],
    }),

    // Обновление реле
    updateRelay: builder.mutation<Relay, UpdateRelayRequest>({
      query: ({ id, ...data }) => ({
        url: `/relays/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Relays', id }],
    }),
    
    // Удаление реле
    deleteRelay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/relays/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Relays'],
    }),

    // Управление реле (включение/выключение)
    toggleRelay: builder.mutation<void, { id: string; state: boolean }>({
      query: ({ id, state }) => ({
        url: `/relays/${id}/toggle`,
        method: 'POST',
        body: { state },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Relays', id }],
    }),

    // Отправка импульса на реле
    pulseRelay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/relays/${id}/pulse`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRelaysQuery,
  useGetRelayByIdQuery,
  useCreateRelayMutation,
  useUpdateRelayMutation,
  useDeleteRelayMutation,
  useToggleRelayMutation,
  usePulseRelayMutation,
} = relaysApi; 