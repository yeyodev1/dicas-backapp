import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.model';

async function seed() {
  if (!process.env.DB_URI) {
    console.error('DB_URI not found — check .env file');
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URI);
  console.log('Connected to DB');

  const email = 'admin@dicasadvisor.org';
  const password = await bcrypt.hash('123456789', 10);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = password;
    existing.accountType = 'admin';
    await existing.save();
    console.log(`Admin password reset: ${email} / 123456789`);
  } else {
    await User.create({ email, password, name: 'Admin Dicas', accountType: 'admin' });
    console.log(`Admin created: ${email} / 123456789`);
  }

  await mongoose.disconnect();
  console.log('Done — corre el backend y loguéate');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
