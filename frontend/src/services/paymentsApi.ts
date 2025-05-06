import { api } from './api';

export interface Payment {
  id: string;
  amount: number; // Сумма в рублях
  orderId: string;
  description?: string;
  userId: string;
  status: boolean;
  tinkoffPaymentId?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface CreatePaymentRequest {
  amount: number; // Сумма в рублях
  description?: string;
}

export interface AdminCreatePaymentRequest {
  userId: string;
  amount: number; // Сумма в рублях
  description?: string;
  status?: boolean;
  tinkoffPaymentId?: string;
  paymentUrl?: string;
}

export interface UpdatePaymentRequest {
  id: string;
  amount?: number; // Сумма в рублях
  description?: string;
  status?: boolean;
  tinkoffPaymentId?: string;
  paymentUrl?: string;
}

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех платежей (для админа)
    getAllPayments: builder.query<Payment[], void>({
      query: () => ({
        url: '/payments',
        method: 'GET',
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Payments' as const, id })),
              { type: 'Payments', id: 'LIST' },
            ]
          : [{ type: 'Payments', id: 'LIST' }],
    }),
    
    // Получение платежа по orderId
    getPaymentByOrderId: builder.query<Payment, string>({
      query: (orderId) => ({
        url: `/payments/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Payments', id: orderId }],
    }),
    
    // Создание нового платежа
    createPayment: builder.mutation<Payment, CreatePaymentRequest>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data, // Не конвертируем сумму, отправляем как есть
      }),
      invalidatesTags: ['Payments'],
    }),
    
    // Администратор создает платеж
    adminCreatePayment: builder.mutation<Payment, AdminCreatePaymentRequest>({
      query: (data) => ({
        url: '/payments/admin',
        method: 'POST',
        body: data, // Не конвертируем сумму, отправляем как есть
      }),
      invalidatesTags: ['Payments'],
    }),
    
    // Обновление платежа администратором
    updatePayment: builder.mutation<Payment, UpdatePaymentRequest>({
      query: ({ id, ...data }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: data, // Не конвертируем сумму, отправляем как есть
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payments', id },
        'Payments',
      ],
    }),
    
    // Установка статуса платежа
    setPaymentStatus: builder.mutation<Payment, { id: string; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/payments/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Payments', id },
        'Payments',
      ],
    }),
    
    // Удаление платежа
    deletePayment: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error) => [
        'Payments',
        { type: 'Payments', id: 'LIST' }
      ],
    }),
    
    // Получение ссылки на оплату для существующего платежа
    getPaymentLink: builder.query<{ success: boolean; url?: string; message?: string }, string>({
      query: (orderId) => ({
        url: `/payments/payment-link/${orderId}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPaymentsQuery,
  useGetPaymentByOrderIdQuery,
  useCreatePaymentMutation,
  useAdminCreatePaymentMutation,
  useUpdatePaymentMutation,
  useSetPaymentStatusMutation,
  useDeletePaymentMutation,
  useLazyGetPaymentLinkQuery,
} = paymentsApi; 