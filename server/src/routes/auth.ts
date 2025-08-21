import { Router, Request, Response } from 'express';
import { createUser, findUserByUsername, verifyPassword } from '../models/userModel';
import { saveRefreshToken, findRefreshToken, deleteRefreshToken } from '../models/tokenModel';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth';
import { AuthRequest, AuthResponse } from '../types';

const router = Router();


router.post('/register', async (req: Request, res: Response) => {
  console.log('Register request received:', req.body);
  try {
    const { username, password }: AuthRequest = req.body;

    if (!username || !password) {
      console.log('Register validation failed: missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      console.log('Register validation failed: password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }


    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      console.log('Register failed: username already exists');
      return res.status(409).json({ error: 'Username already exists' });
    }


    console.log('Creating new user...');
    const user = await createUser(username, password);
    console.log('User created with ID:', user.id);


    const accessToken = generateAccessToken({ userId: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ userId: user.id, username: user.username });


    await saveRefreshToken(user.id, refreshToken);
    console.log('Refresh token saved for user ID:', user.id);

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username
      }
    };

    console.log('Registration successful for user:', username);
    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request received:', req.body);
  try {
    const { username, password }: AuthRequest = req.body;

    if (!username || !password) {
      console.log('Login validation failed: missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }


    const user = await findUserByUsername(username);
    if (!user) {
      console.log('Login failed: user not found -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('Login failed: invalid password for user -', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    const accessToken = generateAccessToken({ userId: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ userId: user.id, username: user.username });


    await saveRefreshToken(user.id, refreshToken);
    console.log('Refresh token saved for user ID:', user.id);

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username
      }
    };

    console.log('Login successful for user:', username);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Находим токен в базе
    const tokenRecord = await findRefreshToken(refreshToken);
    if (!tokenRecord) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }


    try {
      const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key');
      

      const newAccessToken = generateAccessToken({ 
        userId: decoded.userId, 
        username: decoded.username 
      });
      const newRefreshToken = generateRefreshToken({ 
        userId: decoded.userId, 
        username: decoded.username 
      });


      await saveRefreshToken(decoded.userId, newRefreshToken);

      const response: AuthResponse = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: decoded.userId,
          username: decoded.username
        }
      };

      res.json(response);
    } catch (jwtError) {

      await deleteRefreshToken(tokenRecord.userId);
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
