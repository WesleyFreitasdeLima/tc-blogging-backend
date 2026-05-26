import type { Request, Response } from "express";
import type { User } from "./user.entity.js";
import type UserService from "./user.service.js";

class UserController {
  constructor(private readonly userService: UserService) {}

  createUser(req: Request, res: Response): Response {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Name, email, password, and role are required" });
      }

      if (role !== "teacher" && role !== "student") {
        return res.status(400).json({ message: "Role must be either 'teacher' or 'student'" });
      }

      const newUser = this.userService.createUser(name, email, password, role);

      return res.status(201).json({ 
        message: "User created successfully",
        data: newUser
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while creating the user" });
    }
  }

  getAllUsers(req: Request, res: Response): Response {
    try {
      const users: User[] = this.userService.getAllUsers();

      return res.status(200).json({ 
        message: "All users retrieved successfully",
        data: users
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while retrieving users" });
    }
  }

  getUserById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
       
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user: User | undefined = this.userService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ 
        message: "User retrieved successfully",
        data: user
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while retrieving the user" });
    }
  }

  editUserById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
      const { name, email, password, role } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const updatedFields: Partial<Omit<User, "id">> = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      if (password) updatedFields.password = password;
      if (role) {
        if (role !== "teacher" && role !== "student") {
          return res.status(400).json({ message: "Role must be either 'teacher' or 'student'" });
        }
        updatedFields.role = role;
      }

      const updatedUser = this.userService.editUserById(id, updatedFields);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ 
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while updating the user" });
    }
  }

  deleteUserById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
       
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const deleted = this.userService.deleteUserById(id);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ 
        message: "User deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while deleting the user" });
    }
  }
}

export default UserController;