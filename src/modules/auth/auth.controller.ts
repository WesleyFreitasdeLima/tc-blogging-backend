import type { Request, Response } from "express";
import type AuthService from "./auth.service.js";
import { AppAuthNegate } from "../../erros/autth.js";
import { AppError } from "../../erros/error.js";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response): Promise<Response> {
    const { login, password } = req.body;

    const accessToken = await this.authService.login(login, password);

    if (!accessToken) {
      throw new AppAuthNegate("Invalid credentials");
    }

    return res.status(200).json({
      message: "Login successful",
      data: accessToken,
    });
  }
}

export default AuthController;
