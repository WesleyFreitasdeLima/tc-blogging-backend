import { beforeAll, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { randomUUID } from "crypto";

describe("POST /api/users", () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await UserFactory.create({ role: UserRoleEnum.ADMIN });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: admin.username, password: '123456' });

    adminToken = adminLogin.body.data.accessToken;
  });

  it('should create a user successfully', async () => {
    const randomUser = {
      username: `user-${randomUUID()}`,
      email: `user-${randomUUID()}@example.com`
    }

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Doe',
        username: randomUser.username,
        email: randomUser.email,
        password: '123456',
        role: UserRoleEnum.TEACHER,
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: 'User created successfully',
      data: {
        id: expect.any(Number),
        name: 'John Doe',
        username: randomUser.username,
        email: randomUser.email,
        role: UserRoleEnum.TEACHER,
        createdAt: expect.any(String),
        isActive: true
      },
    });
  });

  it('should return 400 when username already exists', async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New teacher',
        username: teacher.username,
        email: 'new-teacher@email.com',
        password: '123456',
        role: UserRoleEnum.TEACHER,
      });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({ message: "Username or email already exists." })
  });

  it('should return 400 when email already exists', async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New teacher',
        username: randomUUID(),
        email: teacher.email,
        password: '123456',
        role: UserRoleEnum.TEACHER,
      });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({ message: "Username or email already exists." })
  });
})