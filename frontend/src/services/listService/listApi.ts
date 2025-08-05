import { api } from '../api';
import { 
  List, 
  CreateListDto, 
  CloseListDto, 
  ListFilters,
  PaginatedListResponse,
  ListStats
} from './list.types';

export const listApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLists: builder.query<PaginatedListResponse, ListFilters | void>({
      query: (params) => ({
        url: '/list',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'List' as const, id })),
            { type: 'List', id: 'LIST' },
          ]
          : [{ type: 'List', id: 'LIST' }],
    }),
    getList: builder.query<List, string>({
      query: (id) => `/list/${id}`,
      providesTags: (result, error, id) => [{ type: 'List', id }],
    }),
    createList: builder.mutation<List, CreateListDto>({
      query: (list) => ({
        url: '/list',
        method: 'POST',
        body: list,
      }),
      invalidatesTags: [{ type: 'List', id: 'LIST' }],
    }),
    closeList: builder.mutation<List, { id: string; data: CloseListDto }>({
      query: ({ id, data }) => ({
        url: `/list/${id}/close`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'List' as const, id: arg.id },
        { type: 'List' as const, id: 'LIST' }
      ],
    }),
    deleteList: builder.mutation<void, string>({
      query: (id) => ({
        url: `/list/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'List' as const, id },
        { type: 'List' as const, id: 'LIST' }
      ],
    }),
    getListStats: builder.query<ListStats, void>({
      query: () => '/list/stats/overview',
      providesTags: [{ type: 'List', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetListsQuery,
  useLazyGetListsQuery,
  useGetListQuery,
  useCreateListMutation,
  useCloseListMutation,
  useDeleteListMutation,
  useGetListStatsQuery,
} = listApi; 