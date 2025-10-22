import { api } from '../api';
import { 
  EmailLog, 
  EmailStats, 
  EmailLogFilters, 
  PaginatedEmailLogResponse
} from './emailLogs.types';

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение логов email
    getEmailLogs: builder.query<PaginatedEmailLogResponse, EmailLogFilters | void>({
      query: (params) => ({
        url: '/notifications/emails',
        params: params || undefined
      }),
      providesTags: ['EmailLogs'],
    }),

    // Получение статистики по email
    getEmailStats: builder.query<EmailStats, void>({
      query: () => '/notifications/emails/stats',
      providesTags: ['EmailLogs'],
    }),
  }),
});

export const {
  useGetEmailLogsQuery,
  useGetEmailStatsQuery,
} = notificationsApi;