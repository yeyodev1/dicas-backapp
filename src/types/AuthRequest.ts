import { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  accountType: 'admin' | 'copywriter';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
