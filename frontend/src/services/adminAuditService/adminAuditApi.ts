import { api } from '../api';

export interface AdminAuditLog {
  id: string;
  adminId: string | null;
  entity: string;
  entityId: string;
  action: string;
  before: any;
  after: any;
  requestId: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: string;
    user: {
      id: string;
      email: string;
    };
  } | null;
}

export interface AuditLogFilters {
  adminId?: string;
  entity?: string;
  entityId?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  data: AdminAuditLog[];
  meta: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditStats {
  totalActions: number;
  actionsByType: Array<{
    action: string;
    count: number;
  }>;
  actionsByEntity: Array<{
    entity: string;
    count: number;
  }>;
  recentActions: AdminAuditLog[];
}

export const adminAuditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<AuditLogResponse, AuditLogFilters>({
      query: (filters) => ({
        url: '/admin-audit/logs',
        method: 'GET',
        params: filters,
      }),
      providesTags: ['AdminAudit'],
    }),
    getAuditStats: builder.query<AuditStats, { adminId?: string; dateFrom?: string; dateTo?: string }>({
      query: (params) => ({
        url: '/admin-audit/stats',
        method: 'GET',
        params,
      }),
      providesTags: ['AdminAudit'],
    }),
    getEntityHistory: builder.query<AdminAuditLog[], { entity: string; entityId: string }>({
      query: ({ entity, entityId }) => ({
        url: '/admin-audit/entity-history',
        method: 'GET',
        params: { entity, entityId },
      }),
      providesTags: ['AdminAudit'],
    }),
    getAdminLogs: builder.query<AuditLogResponse, { adminId: string; entity?: string; action?: string; page?: number; limit?: number }>({
      query: ({ adminId, ...params }) => ({
        url: `/admin-audit/admin/${adminId}/logs`,
        method: 'GET',
        params,
      }),
      providesTags: ['AdminAudit'],
    }),
  }),
});

export const {
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetAuditStatsQuery,
  useGetEntityHistoryQuery,
  useGetAdminLogsQuery,
} = adminAuditApi;
