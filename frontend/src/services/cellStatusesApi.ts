import { api } from './api';

export interface CellStatus {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCellStatusDto {
  name: string;
  color: string;
  isActive?: boolean;
}

export interface UpdateCellStatusDto {
  name?: string;
  color?: string;
  isActive?: boolean;
}

export const cellStatusesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCellStatuses: builder.query<CellStatus[], void>({
      query: () => '/cell-statuses',
      providesTags: ['CellStatuses'],
    }),

    getCellStatus: builder.query<CellStatus, string>({
      query: (id) => `/cell-statuses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'CellStatuses', id }],
    }),

    addCellStatus: builder.mutation<CellStatus, CreateCellStatusDto>({
      query: (status) => ({
        url: '/cell-statuses',
        method: 'POST',
        body: status,
      }),
      invalidatesTags: ['CellStatuses'],
    }),

    updateCellStatus: builder.mutation<CellStatus, UpdateCellStatusDto & { id: string }>({
      query: ({ id, ...status }) => ({
        url: `/cell-statuses/${id}`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CellStatuses', id },
        'CellStatuses',
      ],
    }),

    deleteCellStatus: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cell-statuses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CellStatuses', 'Cells'],
    }),

    assignStatusToCell: builder.mutation<void, { cellId: string; statusId: string }>({
      query: ({ cellId, statusId }) => ({
        url: `/cell-statuses/assign/${statusId}/to-cell/${cellId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Cells', 'CellStatuses'],
    }),

    removeStatusFromCell: builder.mutation<void, string>({
      query: (cellId) => ({
        url: `/cell-statuses/remove-from-cell/${cellId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cells', 'CellStatuses'],
    }),
  }),
});

export const {
  useGetCellStatusesQuery,
  useGetCellStatusQuery,
  useAddCellStatusMutation,
  useUpdateCellStatusMutation,
  useDeleteCellStatusMutation,
  useAssignStatusToCellMutation,
  useRemoveStatusFromCellMutation,
} = cellStatusesApi; 