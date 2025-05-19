import { api } from '../api';
import { 
  CellStatus, 
  CreateCellStatusDto, 
  UpdateCellStatusDto 
} from './cellStatuses.types';

export const cellStatusesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCellStatuses: builder.query<CellStatus[], void>({
      query: () => '/admin/cell-statuses',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CellStatuses' as const, id })),
              { type: 'CellStatuses', id: 'LIST' },
            ]
          : [{ type: 'CellStatuses', id: 'LIST' }],
    }),

    getCellStatus: builder.query<CellStatus, string>({
      query: (id) => `/admin/cell-statuses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'CellStatuses', id }],
    }),

    addCellStatus: builder.mutation<CellStatus, CreateCellStatusDto>({
      query: (status) => ({
        url: '/admin/cell-statuses',
        method: 'POST',
        body: status,
      }),
      invalidatesTags: [{ type: 'CellStatuses', id: 'LIST' }],
    }),

    updateCellStatus: builder.mutation<CellStatus, UpdateCellStatusDto & { id: string }>({
      query: ({ id, ...status }) => ({
        url: `/admin/cell-statuses/${id}`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CellStatuses', id },
        { type: 'CellStatuses', id: 'LIST' },
      ],
    }),

    deleteCellStatus: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/cell-statuses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CellStatuses', 'Cells'],
    }),
  }),
});

export const {
  useGetCellStatusesQuery,
  useGetCellStatusQuery,
  useAddCellStatusMutation,
  useUpdateCellStatusMutation,
  useDeleteCellStatusMutation,
} = cellStatusesApi; 