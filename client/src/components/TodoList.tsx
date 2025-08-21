import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetTodosQuery } from '../store/todoApi';
import { logout } from '../store/authSlice';
import { RootState } from '../store';
import { TodoFilter } from '../types';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка задач...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Не удалось загрузить задачи. Пожалуйста, попробуйте снова.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Список задач</h1>
            <p className="text-gray-600">Добро пожаловать, {user?.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Todo Form */}
        <TodoForm />

        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Все ({todos.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Активные ({activeCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Выполненные ({completedCount})
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {filter === 'all' 
                  ? 'Задач пока нет. Создайте свою первую задачу!'
                  : `Нет ${filter === 'active' ? 'активных' : 'выполненных'} задач.`
                }
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
