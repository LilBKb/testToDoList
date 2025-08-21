import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createTodo, getTodosByUserId, updateTodo, deleteTodo } from '../models/todoModel';
import { CreateTodoRequest, UpdateTodoRequest } from '../types';

const router = Router();


router.use(authenticateToken);


router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const todos = await getTodosByUserId(userId);
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const { title }: CreateTodoRequest = req.body;
    const userId = (req as any).user.userId;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await createTodo(title.trim(), userId);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateTodoRequest = req.body;
    const userId = (req as any).user.userId;

    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }


    if (updates.title !== undefined && updates.title.trim().length === 0) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const updatedTodo = await updateTodo(todoId, updates, userId);
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found or access denied' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const todoId = parseInt(id);
    if (isNaN(todoId)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const deleted = await deleteTodo(todoId, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found or access denied' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
