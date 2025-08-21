import db from '../db';
import { User } from '../types';
import bcrypt from 'bcrypt';

export const createUser = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
        return;
      }

      db.run(
        'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
        [username, hash],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              username,
              passwordHash: hash
            });
          }
        }
      );
    });
  });
};

export const findUserByUsername = (username: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row as User : null);
        }
      }
    );
  });
};

export const findUserById = (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row as User : null);
        }
      }
    );
  });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
