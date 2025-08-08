import { api } from '../api';
import {
  RequestItem,
  CreateRequestDto,
  CloseRequestDto,
  RequestFilters,
  PaginatedRequestResponse,
} from './requests.types';

export const requestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<PaginatedRequestResponse, RequestFilters | void>({
      query: (params) => ({
        url: '/requests',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Requests' as const, id })),
              { type: 'Requests', id: 'LIST' },
            ]
          : [{ type: 'Requests', id: 'LIST' }],
    }),
    getRequest: builder.query<RequestItem, string>({
      query: (id) => `/requests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Requests', id }],
    }),
    // Публичная форма для создания заявки (без авторизации)
    publicCreateRequest: builder.mutation<RequestItem, CreateRequestDto>({
      query: (data) => ({
        url: '/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Requests', id: 'LIST' }],
    }),
    createRequest: builder.mutation<RequestItem, CreateRequestDto>({
      query: (data) => ({
        url: '/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Requests', id: 'LIST' }],
    }),
    closeRequest: builder.mutation<RequestItem, { id: string; data: CloseRequestDto }>({
      query: ({ id, data }) => ({
        url: `/requests/${id}/close`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Requests' as const, id: arg.id },
        { type: 'Requests' as const, id: 'LIST' },
      ],
    }),
    moveToList: builder.mutation<{ listEntry: any; request: RequestItem }, { id: string; data?: CloseRequestDto }>({
      query: ({ id, data }) => ({
        url: `/requests/${id}/move-to-list`,
        method: 'PATCH',
        body: data || {},
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Requests' as const, id: arg.id },
        { type: 'Requests' as const, id: 'LIST' },
        { type: 'List' as const, id: 'LIST' },
      ],
    }),
    deleteRequest: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Requests', id },
        { type: 'Requests', id: 'LIST' },
      ],
    }),
    getRequestsStats: builder.query<{ total: number; byStatus: Record<string, number> }, void>({
      query: () => '/requests/stats/overview',
      providesTags: [{ type: 'Requests', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useLazyGetRequestsQuery,
  useGetRequestQuery,
  usePublicCreateRequestMutation,
  useCreateRequestMutation,
  useCloseRequestMutation,
  useMoveToListMutation,
  useDeleteRequestMutation,
  useGetRequestsStatsQuery,
} = requestsApi;


