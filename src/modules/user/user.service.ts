import type { User } from "./user.entity.js";
import type UserRepository from "./user.repository.js";

class UserService {
  constructor(private userRepository: UserRepository) {}

  createUser(name: string, email: string, password: string, role: "teacher" | "student"): User {
    return this.userRepository.create({ name, email, password, role });
  }

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: number): User | undefined {
    return this.userRepository.findById(id);
  }
}

export default UserService;