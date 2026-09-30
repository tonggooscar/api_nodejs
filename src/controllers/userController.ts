import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { hashPassword } from '../utils/crypto.js';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await db.select({
      id: users.id,
      organization_id: users.organizationId,
      name: users.name,
      email: users.email,
      phone: users.phone,
      status: users.status,
      createdAt: users.createdAt,
    }).from(users);
    res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: (error as Error).message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, organization_id, password } = req.body;
    if (!name || !email || !organization_id || !password) {
      res.status(400).json({ success: false, message: 'name, email, organization_id, and password are required' });
      return;
    }
    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    await db.insert(users).values({
      id: userId,
      organizationId: organization_id,
      name,
      email,
      passwordHash,
      status: 'ACTIVE',
    });
    res.status(201).json({ success: true, message: 'User created successfully', data: { id: userId, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user', error: (error as Error).message });
  }
};
