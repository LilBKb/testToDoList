import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - добавляем access token
    this.api.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - обрабатываем 401 ошибки
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Если refresh token недействителен, очищаем localStorage и перенаправляем на логин
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/api/auth/register', { username, password });
  }

  async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/api/auth/login', { username, password });
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/api/auth/refresh', { refreshToken });
  }

  // Todo endpoints
  async getTodos(): Promise<AxiosResponse<Todo[]>> {
    return this.api.get('/api/todos');
  }

  async createTodo(data: CreateTodoRequest): Promise<AxiosResponse<Todo>> {
    return this.api.post('/api/todos', data);
  }

  async updateTodo(id: number, data: UpdateTodoRequest): Promise<AxiosResponse<Todo>> {
    return this.api.put(`/api/todos/${id}`, data);
  }

  async deleteTodo(id: number): Promise<AxiosResponse<void>> {
    return this.api.delete(`/api/todos/${id}`);
  }

  async toggleTodo(id: number, completed: boolean): Promise<AxiosResponse<Todo>> {
    return this.api.put(`/api/todos/${id}`, { completed });
  }
}

export const apiService = new ApiService();
export default apiService;
