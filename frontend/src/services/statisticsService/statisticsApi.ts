import { api } from '../api';
import { PaginatedStatisticsResponse, StatisticsFilters, StatisticsPayments } from './statistics.types';


export const statisticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // получение статистики по платежам
    getStatisticsPayments: builder.query<PaginatedStatisticsResponse, StatisticsFilters | void>({
      query: (params) => ({
        url: '/statistics/locations',
        params: params || undefined
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ locationId }) => ({ type: 'Statistics' as const, locationId })),
              { type: 'Statistics', id: 'LIST' },
            ]
          : [{ type: 'Statistics', id: 'LIST' }],
    }),

    getStatisticByLocId: builder.query<StatisticsPayments, string>({
      query: (orderId) => `/payments/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Payments', id: orderId }],
    }),
    
  }),
  overrideExisting: false,
});

export const {
  useGetStatisticsPaymentsQuery,
} = statisticsApi; 