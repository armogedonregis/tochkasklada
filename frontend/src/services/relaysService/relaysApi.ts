import { api } from '../api';
import { 
  Relay, 
  RelayType, 
  CreateRelayDto, 
  UpdateRelayDto, 
  ToggleRelayDto 
} from './relays.types';

export const relaysApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRelay: builder.query<Relay, string>({
      query: (id) => `/admin/relays/${id}`,
      providesTags: (result, error, id) => [{ type: 'Relays', id }],
    }),
    
    createRelay: builder.mutation<Relay, CreateRelayDto>({
      query: (relay) => ({
        url: '/admin/relays',
        method: 'POST',
        body: relay,
      }),
      invalidatesTags: [{ type: 'Relays', id: 'LIST' }, { type: 'Panels', id: 'LIST' }],
    }),

    updateRelay: builder.mutation<Relay, UpdateRelayDto & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/admin/relays/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Relays', id },
        { type: 'Relays', id: 'LIST' }
      ],
    }),
    
    deleteRelay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/relays/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Relays', id },
        { type: 'Relays', id: 'LIST' },
        { type: 'Panels', id: 'LIST' },
        'RelayAccess'
      ],
    }),

    toggleRelay: builder.mutation<void, { id: string; state: boolean }>({
      query: ({ id, state }) => ({
        url: `/admin/relays/${id}/toggle`,
        method: 'POST',
        body: { state },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Relays', id }],
    }),

    pulseRelay: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/relays/${id}/pulse`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetRelayQuery,
  useCreateRelayMutation,
  useUpdateRelayMutation,
  useDeleteRelayMutation,
  useToggleRelayMutation,
  usePulseRelayMutation,
} = relaysApi; 