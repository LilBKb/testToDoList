import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => '/api/todos',
      providesTags: ['Todo'],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (todo) => ({
        url: '/api/todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, { id: number; updates: UpdateTodoRequest }>({
      query: ({ id, updates }) => ({
        url: `/api/todos/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todo'],
    }),
    toggleTodo: builder.mutation<Todo, { id: number; completed: boolean }>({
      query: ({ id, completed }) => ({
        url: `/api/todos/${id}`,
        method: 'PUT',
        body: { completed },
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoMutation,
} = todoApi;
