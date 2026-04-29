import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.accountType !== 'admin') {
    res.status(403).json({ message: 'Acceso denegado: solo administradores' });
    return;
  }
  next();
}
