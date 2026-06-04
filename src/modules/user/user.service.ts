import { hash } from "bcryptjs";
import type { IUser } from "./interfaces/user.interface.js";
import type UserRepository from "./user.repository.js";

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IUser[]> {
    return await this.userRepository.findAll(page, limit, search);
  }

  async getUserById(id: number): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByLogin(login: string): Promise<IUser | null> {
    return await this.userRepository.findByLogin(login);
  }

  async createUser(
    user: Omit<IUser, "id" | "createdAt" | "isActive">,
  ): Promise<IUser> {
    const hashedPassword = await hash(user.password, 10);

    const newUser = Object.assign(user, {
      createdAt: new Date(),
      isActive: true,
      password: hashedPassword,
    });

    return await this.userRepository.create(newUser);
  }

  async editUserById(
    id: number,
    updatedFields: Partial<Omit<IUser, "id" | "createdAt">>,
  ): Promise<IUser> {
    const fieldsToUpdate = { ...updatedFields };

    if (fieldsToUpdate.password) {
      fieldsToUpdate.password = await hash(fieldsToUpdate.password, 10);
    }

    return await this.userRepository.editById(id, fieldsToUpdate);
  }

  async deleteUserById(id: number): Promise<boolean> {
    return await this.userRepository.deleteById(id);
  }
}

export default UserService;
