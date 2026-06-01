import type { Repository } from "typeorm";
import { appDataSource } from "../../database/typeorm.js";
import type { IUserRepository } from "./interfaces/user-repository.interface.js";
import { User } from "./user.entity.js";
import type { IUser } from "./interfaces/user.interface.js";
import { AppNotFound } from "../../erros/not-found.js";

class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = appDataSource.getRepository(User);
  }

  async findAll(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IUser[]> {
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

  async findById(id: number): Promise<IUser | null> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async findByLogin(login: string): Promise<IUser | null> {
    return await this.repository.findOne({
      where: { username: login },
    });
  }

  create(user: Omit<IUser, "id">): Promise<IUser> {
    const entity = this.repository.create(user);

    return this.repository.save(entity);
  }

  async editById(
    id: number,
    updatedFields: Partial<Omit<IUser, "id">>,
  ): Promise<IUser> {
    const existingUser = await this.repository.findOne({
      where: { id },
    });

    if (!existingUser) {
      throw new AppNotFound("user");
    }

    Object.assign(existingUser, updatedFields);

    return this.repository.save(existingUser);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      return false;
    }

    return result.affected > 0;
  }
}

export default UserRepository;
