import { hash } from "bcryptjs";
import { randomUUID } from "crypto";

import { appDataSource } from "../../src/database/typeorm";
import { User } from "../../src/modules/user/user.entity";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { TestContext } from "../_helpers/test-context";

export class UserFactory {
  static async create(overrides: Partial<User> = {}) {
    const repository = appDataSource.getRepository(User);

    const hashedPassword = await hash("123456", 10);  

    const user = repository.create({
      name: 'admin__test',
      username: `test__user__${randomUUID()}`,
      email: `test_${randomUUID()}@example.com`,
      createdAt: new Date(),
      password: hashedPassword,
      isActive: true,
      ...overrides
    });

    const savedUser = await repository.save(user);

    TestContext.users.push(savedUser.id!);

    return savedUser;
  }
}