import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as userService from '../services/user.service';

export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ message: 'Email, contraseña y nombre requeridos' });
      return;
    }
    const user = await userService.createUser(email, password, name);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
