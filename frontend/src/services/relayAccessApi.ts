import { api } from './api';
import { 
  RelayAccess, 
  CreateRelayAccessDto, 
  CheckRelayAccessDto, 
  RelayAccessFilters 
} from '../types/relay-access.types';

export const relayAccessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRelayAccesses: builder.query<RelayAccess[], RelayAccessFilters | void>({
      query: (params) => ({
        url: '/admin/relay-access',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RelayAccess' as const, id })),
              { type: 'RelayAccess', id: 'LIST' },
            ]
          : [{ type: 'RelayAccess', id: 'LIST' }],
    }),
    
    getRelayAccessesByRental: builder.query<RelayAccess[], string>({
      query: (rentalId) => `/admin/relay-access/rental/${rentalId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RelayAccess' as const, id })),
              { type: 'RelayAccess', id: 'LIST' },
            ]
          : [{ type: 'RelayAccess', id: 'LIST' }],
    }),
    
    grantAccess: builder.mutation<RelayAccess, CreateRelayAccessDto>({
      query: (access) => ({
        url: '/admin/relay-access',
        method: 'POST',
        body: access,
      }),
      invalidatesTags: [{ type: 'RelayAccess', id: 'LIST' }],
    }),
    
    checkAccess: builder.mutation<boolean, CheckRelayAccessDto>({
      query: (data) => ({
        url: '/admin/relay-access/check',
        method: 'POST',
        body: data,
      }),
    }),
    
    revokeAccess: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/relay-access/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'RelayAccess', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetRelayAccessesQuery,
  useGetRelayAccessesByRentalQuery,
  useGrantAccessMutation,
  useCheckAccessMutation,
  useRevokeAccessMutation,
} = relayAccessApi; 