import { databaseUser } from "../../database/database-config.service.js";
import type { User } from "./user.entity.js";

class UserRepository {
  private readonly db: User[] = databaseUser as User[];

  create(user: Omit<User, "id">): User {
    const id = this.db.length ? Math.max(...this.db.map((u) => u.id)) + 1 : 1;
    const newUser: User = { id, ...user };
    this.db.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return [...this.db];
  }
  
  findById(id: number): User | undefined {
    return this.db.find((user) => user.id === id);
  }
}

export default UserRepository;