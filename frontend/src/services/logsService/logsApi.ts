import { api } from "@/services/api";

export const logsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLogs: build.query<string[], { lines?: number; file?: string } | void>({
      query: (params) => {
        if (!params) return '/logs';
        const { lines = 300, file } = params;
        const searchParams = new URLSearchParams();
        if (lines) searchParams.set('lines', String(lines));
        if (file) searchParams.set('file', file);
        return `/logs?${searchParams.toString()}`;
      },
    }),
    getLogFiles: build.query<string[], void>({
      query: () => '/logs/files',
    }),
  }),
});

export const { useGetLogsQuery, useGetLogFilesQuery } = logsApi; 