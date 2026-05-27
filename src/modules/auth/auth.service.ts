import jwt from 'jsonwebtoken';
import type UserService from '../user/user.service.js';
import type { User } from '../user/user.entity.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
    constructor(private readonly userService: UserService) {}

    login(email: string, password: string): { accessToken: string } | null {
        const user: User | null = this.userService.getUserByEmail(email);

        if (!user || user.password !== password) {
            return null;
        }

        const payload = { 
          sub: user.id,
          email: user.email, 
          role: user.role,
        };

        return {
            accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })
        }
    }
}

export default AuthService;