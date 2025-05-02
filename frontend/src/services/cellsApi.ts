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
      providesTags: ['Cells'],
    }),
    getCellsByContainer: builder.query<Cell[], number>({
      query: (containerId) => `/cells/container/${containerId}`,
      providesTags: ['Cells'],
    }),
    getCellsBySize: builder.query<Cell[], string>({
      query: (sizeId) => `/cells/size/${sizeId}`,
      providesTags: ['Cells'],
    }),
    getCell: builder.query<Cell, string>({
      query: (id) => `/cells/${id}`,
      providesTags: ['Cells'],
    }),
    addCell: builder.mutation<Cell, CreateCellRequest>({
      query: (cell) => ({
        url: '/cells',
        method: 'POST',
        body: cell,
      }),
      invalidatesTags: ['Cells'],
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
      invalidatesTags: ['Cells'],
    }),
    deleteCell: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cells/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cells'],
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