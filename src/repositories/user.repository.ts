import type { Repository } from "typeorm";

import { appDataSource } from "../database/typeorm.js";
import { IUserRepository } from "./interface/user-repository.interface.js";
import { User } from "../entities/user.entity.js";
import { AppNotFound } from "../erros/not-found.js";

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = appDataSource.getRepository(User);
  }
  async getUsers(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<User[]> {
    const query = this.repository.createQueryBuilder("User");

    if (search) {
      query.andWhere(
        `
        User.name ILIKE :search
        OR User.username ILIKE :search
        OR User.email ILIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async createUser(User: Partial<Omit<User, "id">>): Promise<User> {
    User.createdAt = new Date();
    User.isActive = true;
    const entity = this.repository.create(User);

    return this.repository.save(entity);
  }

  async editUserById(
    id: number,
    User: Partial<Omit<User, "id" | "createdAt">>,
  ): Promise<User> {
    const existingUser = await this.repository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new AppNotFound("user");
    }

    const updatedUser = this.repository.merge(existingUser, User);

    return this.repository.save(updatedUser);
  }

  async deleteUserById(id: number): Promise<void> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new AppNotFound("user");
    }
  }
}

export default UserRepository;
