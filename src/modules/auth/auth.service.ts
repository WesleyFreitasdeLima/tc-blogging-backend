import jwt from 'jsonwebtoken';
import type UserService from '../user/user.service.js';
import type { User } from '../user/user.entity.js';

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
            accessToken: jwt.sign(payload, 'your_secret_key', { expiresIn: '2h' })
        }
    }
}

export default AuthService;