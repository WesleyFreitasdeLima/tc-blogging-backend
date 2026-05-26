import { IUser } from "../../entities/interfaces/user.interface.js";

export interface IUserRepository {
  getUsers(
    page: number,
    limit: number,
    search: string | undefined,
  ): Promise<IUser[]>;
  getUserById(id: number): Promise<IUser | null>;
  createUser(User: IUser): Promise<IUser>;
  editUserById(id: number, User: IUser): Promise<IUser>;
  deleteUserById(id: number): Promise<void>;
}
