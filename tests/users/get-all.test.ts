import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";

import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";

describe("GET /api/users", () => {
  let adminToken: string;

  beforeAll(async () => {
    const admin = await UserFactory.create({ role: UserRoleEnum.ADMIN });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: admin.username, password: '123456' });

    adminToken = adminLogin.body.data.accessToken;
  });

  it('should return all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should return users with the expected structure', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    response.body.data.forEach((post: any) => {
      expect(post).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        role: expect.any(String),
        isActive: expect.any(Boolean),
      });
    });
  });
})