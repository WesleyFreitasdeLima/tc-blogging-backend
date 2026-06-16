import { describe, it, expect, beforeAll } from "@jest/globals"
import request from "supertest";

import app from "../../src/app";

import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";

describe("GET /api/users/me", () => {
  let userToken: string;

  beforeAll(async () => {
    const user = await UserFactory.create({ role: UserRoleEnum.USER });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username, password: '123456' });

    userToken = userLogin.body.data.accessToken;
  });

  it('should return authenticated user data', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: "User retrieved successfully",
      data: {
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        createdAt: expect.any(String),
        isActive: expect.any(Boolean),
      },
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.status).toBe(401);
  });
})