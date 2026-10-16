import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod Validation Error
  if (err instanceof ZodError) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      error: 'Validation failed',
      details: fieldErrors,
    });
    return;
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      error: `Invalid resource identifier: ${err.value}`,
    });
    return;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      error: `An account with that ${field} already exists.`,
    });
    return;
  }

  // Handle known HTTP errors
  if (err.statusCode && typeof err.statusCode === 'number') {
    res.status(err.statusCode).json({
      error: err.message || 'An error occurred',
    });
    return;
  }

  // Unhandled / 500 Internal Error
  console.error('[Unhandled Error]', err);
  const isProd = env.NODE_ENV === 'production';
  res.status(500).json({
    error: isProd ? 'Internal server error. Please try again later.' : (err.message || 'Internal server error'),
  });
}
