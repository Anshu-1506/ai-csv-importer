import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      error: 'File upload error',
      details: err.message
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
  return;
};