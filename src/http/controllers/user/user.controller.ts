import type { Request, Response } from "express";
import UserService from "../../../services/user.service.js";
import { User } from "../../../entities/user.entity.js";

class UserController {
  constructor(private readonly postService: UserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const { name, username, password, email } = req.body;

      if (!name || !username || !password || !email) {
        return res
          .status(400)
          .json({ message: "Name, username, password and email are required" });
      }

      const newUser: User = await this.postService.createUser({
        name: name,
        username: username,
        password: password,
        email: email,
      });

      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error occurred while creating the user" });
    }
  }

  async getAllUser(req: Request, res: Response) {
    const posts: User[] = await this.postService.getUsers();

    return res.status(200).json({
      message: "All users retrieved successfully",
      data: posts,
    });
  }
}

export { UserController };
