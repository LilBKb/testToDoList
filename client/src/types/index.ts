export interface User {
  id: number;
  username: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface ApiError {
  error: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';
