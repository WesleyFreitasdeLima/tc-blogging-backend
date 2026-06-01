import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import type UserService from "../user/user.service.js";
import type { User } from "../user/user.entity.js";
import type { IUser } from "../user/interfaces/user.interface.js";
import { AppRegraNegocio } from "../../erros/regra-negocio.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(
    login: string,
    password: string,
  ): Promise<{ accessToken: string } | null> {
    const user: IUser | null = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new AppRegraNegocio("Login or Password invalid.");
    }

    const doestPassword = await compare(password, user.password);

    if (!doestPassword) {
      throw new AppRegraNegocio("Login or Password invalid.");
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" }),
    };
  }
}

export default AuthService;
