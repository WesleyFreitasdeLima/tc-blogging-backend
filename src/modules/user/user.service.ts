import type { User } from "./user.entity.js";
import type UserRepository from "./user.repository.js";

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  createUser(name: string, email: string, password: string, role: "teacher" | "student"): User {
    return this.userRepository.create({ name, email, password, role });
  }

  getAllUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: number): User | undefined {
    return this.userRepository.findById(id);
  }

  editUserById(id: number, updatedFields: Partial<Omit<User, "id">>): User | undefined {
    return this.userRepository.editById(id, updatedFields);
  }

  deleteUserById(id: number): boolean {
    return this.userRepository.deleteById(id);
  }
}

export default UserService;