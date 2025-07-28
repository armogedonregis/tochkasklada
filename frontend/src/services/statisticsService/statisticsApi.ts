import { api } from '../api';
import { 
  PaginatedStatisticsResponse, 
  StatisticsFilters, 
  StatisticsPayments,
  PaginatedLocationPaymentsResponse,
  LocationPaymentFilters
} from './statistics.types';

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

    // получение детальных платежей по локации
    getLocationPayments: builder.query<PaginatedLocationPaymentsResponse, { locationId: string } & LocationPaymentFilters>({
      query: ({ locationId, ...params }) => ({
        url: `/statistics/locations/${locationId}/payments`,
        params
      }),
      providesTags: (result, error, { locationId }) => [
        { type: 'Statistics', id: `LOCATION_PAYMENTS_${locationId}` },
      ],
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
  useGetLocationPaymentsQuery,
} = statisticsApi; 