import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import * as userService from '../services/user.service';

export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).send({ message: "Email, password and name are required." });
      return;
    }
    const user = await userService.createUser(email, password, name);
    
    res.status(201).send({
      message: "User created successfully.",
      user
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await userService.listUsers();
    
    res.status(200).send({
      message: "Users retrieved successfully.",
      users
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    
    res.status(200).send({
      message: "User updated successfully.",
      user
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    
    res.status(200).send({
      message: "User deleted successfully."
    });
    return;
  } catch (error) {
    next(error);
  }
}
