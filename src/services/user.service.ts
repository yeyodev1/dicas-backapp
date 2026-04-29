import bcrypt from 'bcryptjs';
import User from '../models/User.model';
import { CustomError } from '../errors/customError.error';

export async function createUser(email: string, password: string, name: string) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new CustomError('Email ya registrado', 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name, accountType: 'copywriter' });

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    accountType: user.accountType,
    createdAt: user.createdAt,
  };
}

export async function listUsers() {
  return User.find().select('-password').sort({ createdAt: -1 });
}
