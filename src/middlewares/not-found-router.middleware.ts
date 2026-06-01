import type { Request, Response, NextFunction } from "express";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
