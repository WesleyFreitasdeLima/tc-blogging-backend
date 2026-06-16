import { describe, it, expect, beforeAll } from "@jest/globals"
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";

describe("DELETE /api/users/me", () => {
  let userToken: string;

  beforeAll(async () => {
    const user = await UserFactory.create({ role: UserRoleEnum.USER });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username, password: '123456' });

    userToken = userLogin.body.data.accessToken;
  });

  it('should delete authenticated user account', async () => {
    const response = await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'User deleted successfully',
    });
  });

  it('should not allow access after account deletion', async () => {
    await request(app)
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(404);
  });
})