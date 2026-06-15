import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppAuthForbiden, AppAuthNegate } from "../erros/autth.js";
import { UserRoleEnum } from "../enum/user-role.enum.js";
import { env } from "../env/index.js";

const JWT_SECRET = env.JWT_SECRET as string;

export interface JwtPayload {
  sub: number;
  role: UserRoleEnum;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppAuthNegate("Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    req.user = decoded;

    next();
  } catch {
    throw new AppAuthNegate("Invalid or expired token");
  }
}

export function verifyRole(role: UserRoleEnum) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppAuthForbiden("Forbidden: insufficient permissions");
    }
    if (req.user.role !== UserRoleEnum.ADMIN) {
      if (req.user.role !== role) {
        throw new AppAuthForbiden("Forbidden: insufficient permissions");
      }
    }

    next();
  };
}
