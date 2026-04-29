import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { CustomError } from '../errors/customError.error';

export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw new CustomError('Credenciales inválidas', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new CustomError('Credenciales inválidas', 401);

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, accountType: user.accountType },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return {
    access_token: token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      accountType: user.accountType,
    },
  };
}
