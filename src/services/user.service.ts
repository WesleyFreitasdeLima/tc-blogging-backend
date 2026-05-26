import { User } from "../entities/user.entity.js";
import UserRepository from "../repositories/user.repository.js";

class UserService {
  constructor(private readonly userRepository: UserRepository) {
    this.userRepository = new UserRepository();
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined,
  ): Promise<User[]> {
    return await this.userRepository.getUsers(page, limit, search);
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async createUser(User: Partial<User>): Promise<User> {
    return await this.userRepository.createUser(User);
  }

  async editUserById(id: number, User: Partial<User>): Promise<User> {
    return this.userRepository.editUserById(id, User);
  }

  async deleteUserById(id: number): Promise<void> {
    return await this.userRepository.deleteUserById(id);
  }
}

export default UserService;
