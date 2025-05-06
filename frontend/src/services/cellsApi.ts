import { api } from './api';

export interface Size {
  id: string;
  name: string;
  size: string;
  area: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface City {
  id: string;
  title: string;
  short_name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: string;
  name: string;
  short_name: string;
  address: string;
  cityId: string;
  city?: City;
  createdAt?: string;
  updatedAt?: string;
}

export interface Container {
  id: number;
  locId: string;
  location?: Location;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cell {
  id: string;
  name: string;
  containerId: number;
  size_id: string;
  len_height?: string;
  container?: Container;
  size?: Size;
  createdAt?: string;
  updatedAt?: string;
}

// Тип для создания ячейки
export interface CreateCellRequest {
  name: string;
  containerId: number;
  size_id: string;
  len_height?: string;
}

export const cellsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCells: builder.query<Cell[], void>({
      query: () => '/cells',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cells' as const, id })),
              { type: 'Cells', id: 'LIST' },
            ]
          : [{ type: 'Cells', id: 'LIST' }],
    }),
    getCellsByContainer: builder.query<Cell[], number>({
      query: (containerId) => `/cells/container/${containerId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cells' as const, id })),
              { type: 'Cells' as const, id: 'LIST' }
            ]
          : [{ type: 'Cells' as const, id: 'LIST' }],
    }),
    getCellsBySize: builder.query<Cell[], string>({
      query: (sizeId) => `/cells/size/${sizeId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cells' as const, id })),
              { type: 'Cells' as const, id: 'LIST' }
            ]
          : [{ type: 'Cells' as const, id: 'LIST' }],
    }),
    getCell: builder.query<Cell, string>({
      query: (id) => `/cells/${id}`,
      providesTags: (result, error, id) => [{ type: 'Cells', id }],
    }),
    addCell: builder.mutation<Cell, CreateCellRequest>({
      query: (cell) => ({
        url: '/cells',
        method: 'POST',
        body: cell,
      }),
      invalidatesTags: [{ type: 'Cells', id: 'LIST' }],
    }),
    updateCell: builder.mutation<Cell, Partial<Cell> & { id: string }>({
      query: (cell) => {
        const { id, ...body } = cell;
        return {
          url: `/cells/${id}`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'Cells' as const, id: arg.id },
        { type: 'Cells' as const, id: 'LIST' }
      ],
    }),
    deleteCell: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cells/${id}`,
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
  useGetCellsQuery,
  useGetCellsByContainerQuery,
  useGetCellsBySizeQuery,
  useGetCellQuery,
  useAddCellMutation,
  useUpdateCellMutation,
  useDeleteCellMutation,
} = cellsApi; 