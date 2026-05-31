import type { IUser } from "./user.interface.js";

export interface IUserRepository {
  findAll(
    page: number,
    limit: number,
    search: string | undefined,
  ): Promise<IUser[]>;
  findById(id: number): Promise<IUser | null>;
  findByLogin(login: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  editById(id: number, user: IUser): Promise<IUser>;
  deleteById(id: number): Promise<boolean>;
}
