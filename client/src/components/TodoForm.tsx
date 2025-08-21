import React, { useState } from 'react';
import { useCreateTodoMutation } from '../store/todoApi';

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    try {
      await createTodo({ title: title.trim() });
      setTitle('');
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Что нужно сделать?"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Добавление...' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
