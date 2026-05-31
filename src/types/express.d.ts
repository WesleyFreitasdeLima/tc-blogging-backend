import type { JwtPayload } from "../middlewares/verify-auth.middleware.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
