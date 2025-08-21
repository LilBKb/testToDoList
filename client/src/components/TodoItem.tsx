import React, { useState } from 'react';
import { Todo } from '../types';
import { useUpdateTodoMutation, useDeleteTodoMutation, useToggleTodoMutation } from '../store/todoApi';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [toggleTodo, { isLoading: isToggling }] = useToggleTodoMutation();

  const handleToggle = async () => {
    try {
      await toggleTodo({ id: todo.id, completed: !todo.completed });
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) return;
    
    try {
      await updateTodo({ id: todo.id, updates: { title: editTitle.trim() } });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isToggling}
        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleEdit}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        ) : (
          <span
            className={`block truncate cursor-pointer ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isUpdating}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
        >
          {isEditing ? 'Отмена' : 'Изменить'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
