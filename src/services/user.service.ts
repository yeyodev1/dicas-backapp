import bcrypt from 'bcryptjs';
import models from '../models';
import { CustomError } from '../errors/customError.error';

export async function createUser(email: string, password: string, name: string) {
  const existing = await models.users.findOne({ email: email.toLowerCase() });
  if (existing) throw new CustomError('Email already registered', 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await models.users.create({ email, password: hashed, name, accountType: 'copywriter' });

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    accountType: user.accountType,
    createdAt: user.createdAt,
  };
}

export async function listUsers() {
  return models.users.find().select('-password').sort({ createdAt: -1 });
}

export async function updateUser(id: string, data: Partial<{ name: string; email: string; accountType: string; password?: string }>) {
  const user = await models.users.findById(id);
  if (!user) throw new CustomError('User not found', 404);

  if (data.email) {
    const existing = await models.users.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
    if (existing) throw new CustomError('Email already in use by another user', 409);
    user.email = data.email.toLowerCase();
  }

  if (data.name) user.name = data.name;
  if (data.accountType) user.accountType = data.accountType as any;
  
  if (data.password) {
    user.password = await bcrypt.hash(data.password, 10);
  }

  await user.save();
  
  const updatedUser = user.toObject();
  delete (updatedUser as any).password;
  return updatedUser;
}

export async function deleteUser(id: string) {
  const user = await models.users.findById(id);
  if (!user) throw new CustomError('User not found', 404);
  
  // Prevent deleting the last admin if necessary, or just allow it for now as per simplicity
  await user.deleteOne();
}
