import type UserService from "./user.service.js";

class UserController {
  constructor(private userService: UserService) {}

  createUser(req: any, res: any) {
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
}

export default UserController;