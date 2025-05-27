import { api } from '../api';
import { 
  Payment, 
  CreatePaymentDto, 
  CreateAdminPaymentDto, 
  UpdatePaymentDto,
  PaymentFilters,
  SetPaymentStatusDto,
  PaginatedPaymentResponse,
  StatisticsPayments
} from './payments.types';

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех платежей (для админа) с фильтрацией
    getAllPayments: builder.query<PaginatedPaymentResponse, PaymentFilters | void>({
      query: (params) => ({
        url: '/payments',
        params: params || undefined
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payments' as const, id })),
              { type: 'Payments', id: 'LIST' },
            ]
          : [{ type: 'Payments', id: 'LIST' }],
    }),

    // Получение платежей текущего пользователя
    getUserPayments: builder.query<Payment[], void>({
      query: () => '/payments/my',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Payments' as const, id })),
              { type: 'Payments', id: 'LIST' },
            ]
          : [{ type: 'Payments', id: 'LIST' }],
    }),

    // получение статистики по платежам
    getStatisticsPayments: builder.query<StatisticsPayments[], void>({
      query: (params) => ({
        url: '/payments/statistics',
      }),
    }),
    
    // Получение платежа по orderId
    getPaymentByOrderId: builder.query<Payment, string>({
      query: (orderId) => `/payments/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Payments', id: orderId }],
    }),
    
    // Создание нового платежа
    createPayment: builder.mutation<Payment, CreatePaymentDto>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Payments', id: 'LIST' }],
    }),
    
    // Администратор создает платеж
    adminCreatePayment: builder.mutation<Payment, CreateAdminPaymentDto>({
      query: (data) => ({
        url: '/payments/admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Payments', id: 'LIST' }],
    }),
    
    // Обновление платежа администратором
    updatePayment: builder.mutation<Payment, UpdatePaymentDto & { id: string }>({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' },
      ],
    }),
    
    // Установка статуса платежа
    setPaymentStatus: builder.mutation<Payment, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/payments/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' },
      ],
    }),
    
    // Удаление платежа
    deletePayment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Payments', id },
        { type: 'Payments', id: 'LIST' }
      ],
    }),
    
    // Получение ссылки на оплату для существующего платежа
    getPaymentLink: builder.query<{ success: boolean; url?: string; message?: string }, string>({
      query: (orderId) => `/payments/payment-link/${orderId}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPaymentsQuery,
  useGetUserPaymentsQuery,
  useGetPaymentByOrderIdQuery,
  useGetStatisticsPaymentsQuery,
  useCreatePaymentMutation,
  useAdminCreatePaymentMutation,
  useUpdatePaymentMutation,
  useSetPaymentStatusMutation,
  useDeletePaymentMutation,
  useLazyGetPaymentLinkQuery,
} = paymentsApi; 