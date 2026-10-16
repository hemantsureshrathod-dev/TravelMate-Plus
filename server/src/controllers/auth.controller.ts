import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

function signToken(userId: string, email: string): string {
  return jwt.sign({ id: userId, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: validated.email });
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }

    const user = await User.create({
      name: validated.name,
      email: validated.email,
      password: validated.password,
    });

    const token = signToken(user._id.toString(), user.email);

    res.status(201).json({
      message: 'Registration successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email }).select('+password');
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(validated.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = signToken(user._id.toString(), user.email);

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User account not found' });
      return;
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
}
