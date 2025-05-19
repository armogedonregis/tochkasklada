import { api } from '../api';
import { 
  Cell, 
  CreateCellDto, 
  UpdateCellDto, 
  CellFilters,
  PaginatedCellResponse
} from './cell.types';

export const cellsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCells: builder.query<PaginatedCellResponse, CellFilters | void>({
      query: (params) => ({
        url: '/admin/cells',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Cells' as const, id })),
            { type: 'Cells', id: 'LIST' },
          ]
          : [{ type: 'Cells', id: 'LIST' }],
    }),
    getCell: builder.query<Cell, string>({
      query: (id) => `/admin/cells/${id}`,
      providesTags: (result, error, id) => [{ type: 'Cells', id }],
    }),
    addCell: builder.mutation<Cell, CreateCellDto>({
      query: (cell) => ({
        url: '/admin/cells',
        method: 'POST',
        body: cell,
      }),
      invalidatesTags: [{ type: 'Cells', id: 'LIST' }],
    }),
    updateCell: builder.mutation<Cell, UpdateCellDto & { id: string }>({
      query: (cell) => {
        const { id, ...body } = cell;
        return {
          url: `/admin/cells/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Cells' as const, id: arg.id },
        { type: 'Cells' as const, id: 'LIST' }
      ],
    }),
    deleteCell: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/cells/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Cells' as const, id },
        { type: 'Cells' as const, id: 'LIST' }
      ],
    }),
  }),
});

export const {
  useGetAdminCellsQuery,
  useGetCellQuery,
  useAddCellMutation,
  useUpdateCellMutation,
  useDeleteCellMutation,
} = cellsApi; 