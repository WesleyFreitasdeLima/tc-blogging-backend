import type { NextFunction, Request, Response } from "express";
import { AppError } from "../erros/error.js";
import { AppNotFound } from "../erros/not-found.js";
import { AppAuthNegate } from "../erros/autth.js";
import { AppRegraNegocio } from "../erros/regra-negocio.js";
import { ZodError } from "zod";
import { QueryFailedError } from "typeorm";

export function errorMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (
    error instanceof AppError ||
    error instanceof AppNotFound ||
    error instanceof AppAuthNegate ||
    error instanceof AppRegraNegocio
  ) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  } else if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Internal server error",
  });
}
