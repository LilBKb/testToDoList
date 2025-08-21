# Todo List Application

Полнофункциональное приложение "Список задач" с аутентификацией и хранением данных на сервере.

## Технологии

### Frontend
- React + TypeScript
- Vite
- Redux Toolkit (RTK Query)
- Axios
- Tailwind CSS
- React Router

### Backend
- Node.js + Express
- TypeScript
- SQLite
- JWT аутентификация
- bcrypt для хэширования паролей

## Установка и запуск

### 1. Установка зависимостей

```bash
# Установка зависимостей для бэкенда
cd server
npm install

# Установка зависимостей для фронтенда
cd ../client
npm install
```

### 2. Запуск приложения

```bash
# Запуск бэкенда (порт 3000)
cd server
npm run dev

# В новом терминале - запуск фронтенда (порт 5173)
cd client
npm run dev
```

### 3. Открытие в браузере

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/refresh` - Обновление токена

### Задачи (требуют аутентификации)
- `GET /api/todos` - Получение списка задач
- `POST /api/todos` - Создание новой задачи
- `PUT /api/todos/:id` - Обновление задачи
- `DELETE /api/todos/:id` - Удаление задачи

## Функциональность

- Регистрация и вход пользователей
- Создание, редактирование, удаление задач
- Отметка задач как выполненных
- Фильтрация задач (Все/Активные/Выполненные)
- JWT аутентификация с refresh токенами
- Responsive UI с Tailwind CSS
- Полная типизация TypeScript

## Структура проекта

```
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Node.js + Express)
└── README.md
```
