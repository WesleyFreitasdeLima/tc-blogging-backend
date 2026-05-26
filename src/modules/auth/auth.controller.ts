import type { Request, Response } from "express";
import type AuthService from "./auth.service.js";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const accessToken = this.authService.login(email, password);

      if (!accessToken) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      return res.status(200).json({ 
        message: "Login successful", 
        data: accessToken
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred during login" });
    }
  }
}

export default AuthController;