import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = 'your_secret_key';

export interface JwtPayload {
    sub: number;
    email: string;
    role: 'teacher' | 'student';
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function verifyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid authorization header' });
        return;
    }

    const token = authHeader.split(' ')[1] as string;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export function verifyRole(role: 'teacher' | 'student') {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (req.user?.role !== role) {
            res.status(403).json({ message: 'Forbidden: insufficient permissions' });
            return;
        }
        next();
    };
}
