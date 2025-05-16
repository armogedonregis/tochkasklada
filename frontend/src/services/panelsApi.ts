import { api } from './api';
import { 
  Panel, 
  CreatePanelDto, 
  UpdatePanelDto, 
  PanelFilters 
} from '../types/panel.types';

export const panelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPanels: builder.query<Panel[], PanelFilters | void>({
      query: (params) => ({
        url: '/admin/panels',
        params: params || undefined
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Panels' as const, id })),
              { type: 'Panels' as const, id: 'LIST' },
            ]
          : [{ type: 'Panels' as const, id: 'LIST' }],
    }),
    
    getPanel: builder.query<Panel, string>({
      query: (id) => `/admin/panels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Panels', id }],
    }),
    
    createPanel: builder.mutation<Panel, CreatePanelDto>({
      query: (panel) => ({
        url: '/admin/panels',
        method: 'POST',
        body: panel,
      }),
      invalidatesTags: [{ type: 'Panels', id: 'LIST' }],
    }),
    
    updatePanel: builder.mutation<Panel, UpdatePanelDto & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/admin/panels/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Panels', id },
        { type: 'Panels', id: 'LIST' },
      ],
    }),
    
    deletePanel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/panels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Panels' as const, id },
        { type: 'Panels' as const, id: 'LIST' },
        'Relays' as const
      ],
    }),

    checkPanelConnection: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/admin/panels/${id}/check-connection`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetPanelsQuery,
  useGetPanelQuery,
  useCreatePanelMutation,
  useUpdatePanelMutation,
  useDeletePanelMutation,
  useCheckPanelConnectionMutation,
} = panelsApi; 