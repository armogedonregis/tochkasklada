import { api } from '../api';
import { User, CreateUserDto, UpdateUserDto } from './users.types';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить всех пользователей
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users' as const, id: 'LIST' },
            ]
          : [{ type: 'Users' as const, id: 'LIST' }],
    }),

    // Получить пользователя по ID
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    // Создать пользователя
    createUser: builder.mutation<User, CreateUserDto>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'Users' as const, id: 'LIST' }],
    }),

    // Обновить пользователя
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    // Удалить пользователя
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users' as const, id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
