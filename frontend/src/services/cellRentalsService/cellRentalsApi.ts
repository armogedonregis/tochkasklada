import { api } from '../api';
import { 
  CellRental, 
  CreateCellRentalDto, 
  UpdateCellRentalDto, 
  CellRentalFilters 
} from './cellRentals.types';

export const cellRentalsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех аренд для админа
    getCellRentals: builder.query<CellRental[], CellRentalFilters | void>({
      query: (params) => ({
        url: '/admin/cell-rentals',
        params: params || undefined
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CellRentals' as const, id })),
              { type: 'CellRentals', id: 'LIST' },
            ]
          : [{ type: 'CellRentals', id: 'LIST' }],
    }),
    
    // Получение аренды по ID
    getCellRental: builder.query<CellRental, string>({
      query: (id) => `/admin/cell-rentals/${id}`,
      providesTags: (result, error, id) => [{ type: 'CellRentals', id }],
    }),
    
    // Создание новой аренды
    createCellRental: builder.mutation<CellRental, CreateCellRentalDto>({
      query: (rental) => ({
        url: '/admin/cell-rentals',
        method: 'POST',
        body: rental,
      }),
      invalidatesTags: [{ type: 'CellRentals', id: 'LIST' }, 'Cells'],
    }),
    
    // Обновление аренды
    updateCellRental: builder.mutation<CellRental, UpdateCellRentalDto & { id: string }>({
      query: ({ id, ...rental }) => ({
        url: `/admin/cell-rentals/${id}`,
        method: 'PATCH',
        body: rental,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'CellRentals', id },
        { type: 'CellRentals', id: 'LIST' },
        'Cells'
      ],
    }),
    
    // Удаление аренды
    deleteCellRental: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/cell-rentals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'CellRentals', id },
        { type: 'CellRentals', id: 'LIST' },
        'Cells',
        'RelayAccess'
      ],
    }),

    // Получение аренд для клиента
    getClientRentals: builder.query<CellRental[], string>({
      query: (clientId) => `/admin/cell-rentals/client/${clientId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'CellRentals' as const, id })),
              { type: 'CellRentals', id: 'LIST' },
            ]
          : [{ type: 'CellRentals', id: 'LIST' }],
    }),

    // Получение активных аренд для ячейки
    getCellActiveRentals: builder.query<CellRental[], string>({
      query: (cellId) => `/admin/cell-rentals/cell/${cellId}?isActive=true`,
      providesTags: (result, error, cellId) => [
        ...result 
          ? result.map(({ id }) => ({ type: 'CellRentals' as const, id }))
          : [],
        { type: 'CellRentals', id: `cell_${cellId}` }
      ],
    }),
  }),
});

export const {
  useGetCellRentalsQuery,
  useGetCellRentalQuery,
  useCreateCellRentalMutation,
  useUpdateCellRentalMutation,
  useDeleteCellRentalMutation,
  useGetClientRentalsQuery,
  useGetCellActiveRentalsQuery,
} = cellRentalsApi; 