export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface Token {
  userId: number;
  refreshToken: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
  };
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

export interface JwtPayload {
  userId: number;
  username: string;
  iat: number;
  exp: number;
}

// Правильное расширение Express Request
export interface AuthenticatedRequest {
  user?: JwtPayload;
}
