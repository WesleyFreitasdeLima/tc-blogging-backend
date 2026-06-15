import { describe, it, expect, beforeAll } from "@jest/globals"
import request from "supertest";

import app from "../../src/app";

describe("DELETE /api/users/me", () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'inative_user', password: '123456' });

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'admin', password: '123456' });

    userToken = userLogin.body.data.accessToken;
    adminToken = userLogin.body.data.accessToken;
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
      .set('Authorization', `Bearer ${adminToken}`);

    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });
})