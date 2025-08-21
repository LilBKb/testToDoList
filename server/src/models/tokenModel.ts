import db from '../db';
import { Token } from '../types';

export const saveRefreshToken = (userId: number, refreshToken: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Удаляем старый токен пользователя
    db.run('DELETE FROM tokens WHERE userId = ?', [userId], (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Сохраняем новый токен
      db.run(
        'INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)',
        [userId, refreshToken],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
};

export const findRefreshToken = (refreshToken: string): Promise<Token | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM tokens WHERE refreshToken = ?',
      [refreshToken],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row as Token : null);
        }
      }
    );
  });
};

export const deleteRefreshToken = (userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM tokens WHERE userId = ?', [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
