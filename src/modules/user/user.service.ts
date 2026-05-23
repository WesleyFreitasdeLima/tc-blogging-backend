import type UserRepository from "./user.repository.js";

class UserService {
  constructor(private userRepository: UserRepository) {}

  createUser(name: string, email: string, password: string, role: "teacher" | "student") {
    return this.userRepository.create({ name, email, password, role });
  }

  getAllUsers() {
    return this.userRepository.findAll();
  }
}

export default UserService;