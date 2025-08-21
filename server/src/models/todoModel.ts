import db from '../db';
import { Todo } from '../types';

export const createTodo = (title: string, userId: number): Promise<Todo> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO todos (title, userId) VALUES (?, ?)',
      [title, userId],
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            title,
            completed: false,
            userId
          });
        }
      }
    );
  });
};

export const getTodosByUserId = (userId: number): Promise<Todo[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM todos WHERE userId = ? ORDER BY id DESC',
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Todo[]);
        }
      }
    );
  });
};

export const updateTodo = (id: number, updates: Partial<Todo>, userId: number): Promise<Todo | null> => {
  return new Promise((resolve, reject) => {
    // Проверяем, что задача принадлежит пользователю
    db.get(
      'SELECT * FROM todos WHERE id = ? AND userId = ?',
      [id, userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          const todo = row as Todo;
          const updatedTodo = { ...todo, ...updates };
          
          db.run(
            'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
            [updatedTodo.title, updatedTodo.completed ? 1 : 0, id],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(updatedTodo);
              }
            }
          );
        }
      }
    );
  });
};

export const deleteTodo = (id: number, userId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Проверяем, что задача принадлежит пользователю
    db.get(
      'SELECT * FROM todos WHERE id = ? AND userId = ?',
      [id, userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(false);
        } else {
          db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        }
      }
    );
  });
};
