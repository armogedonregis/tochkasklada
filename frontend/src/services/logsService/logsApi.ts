import { api } from "@/services/api";

export const logsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLogs: build.query<string[], number | void>({
      query: (lines = 200) => `/logs?lines=${lines}`,
    }),
  }),
});

export const { useGetLogsQuery } = logsApi; 