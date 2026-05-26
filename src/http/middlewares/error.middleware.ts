import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../erros/error.js";
import { AppNotFound } from "../../erros/not-found.js";

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (
    error instanceof AppError ||
    error instanceof AppNotFound
  ) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Internal server error",
  });
}
