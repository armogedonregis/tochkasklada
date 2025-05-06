import { api } from './api';
import { Panel, CreatePanelRequest, UpdatePanelRequest } from '../types/panel.types';

export const panelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получение списка панелей
    getPanels: builder.query<Panel[], void>({
      query: () => ({
        url: '/panels',
        method: 'GET',
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Panels' as const, id })),
              { type: 'Panels' as const, id: 'LIST' },
            ]
          : [{ type: 'Panels' as const, id: 'LIST' }],
    }),
    
    // Получение панели по ID
    getPanelById: builder.query<Panel, string>({
      query: (id) => ({
        url: `/panels/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Panels', id }],
    }),
    
    // Создание панели
    createPanel: builder.mutation<Panel, CreatePanelRequest>({
      query: (panel) => ({
        url: '/panels',
        method: 'POST',
        body: panel,
      }),
      invalidatesTags: ['Panels'],
    }),
    
    // Обновление панели
    updatePanel: builder.mutation<Panel, UpdatePanelRequest>({
      query: ({ id, ...patch }) => ({
        url: `/panels/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Panels', id },
        'Panels',
      ],
    }),
    
    // Удаление панели
    deletePanel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/panels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Panels' as const, id },
        { type: 'Panels' as const, id: 'LIST' },
        'Relays' as const
      ],
    }),

    // Проверка соединения с панелью
    checkPanelConnectionManual: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/panels/${id}/check-connection`,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPanelsQuery,
  useGetPanelByIdQuery,
  useCreatePanelMutation,
  useUpdatePanelMutation,
  useDeletePanelMutation,
  useCheckPanelConnectionManualMutation,
} = panelsApi; 