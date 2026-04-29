import dotenv from "dotenv";
dotenv.config();

import { dbConnect } from "./config/mongo";
import { createApp } from "./app";
import bcrypt from "bcryptjs";
import User from "./models/User.model";
import type { Request, Response } from "express";

let initialized = false;

async function ensureAdmin() {
  const email = "admin@dicasadvisor.org";
  const existing = await User.findOne({ email });
  if (!existing) {
    const password = await bcrypt.hash("123456789", 10);
    await User.create({ email, password, name: "Admin Dicas", accountType: "admin" });
    console.log("✓ Admin creado");
  }
}

async function initialize() {
  if (initialized) return;
  await dbConnect();
  await ensureAdmin();
  initialized = true;
}

const { app, server } = createApp();

export default async function handler(req: Request, res: Response) {
  await initialize();
  return app(req, res);
}

if (require.main === module) {
  const port = process.env.PORT || 8100;
  initialize().then(() => {
    server.timeout = 10 * 60 * 1000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
}
