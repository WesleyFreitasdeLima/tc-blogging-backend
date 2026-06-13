import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";

describe("DELETE /api/posts", () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'admin', password: '123456' });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'inative_user', password: '123456' });

    adminToken = adminLogin.body.data.accessToken;
    userToken = userLogin.body.data.accessToken;
  });

  it('should delete a post successfully', async () => {
    const response = await request(app)
      .delete('/api/posts/101')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'Post deleted successfully',
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .delete('/api/posts/101');

    expect(response.status).toBe(401);
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .delete('/api/posts/101')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  it('should return 403 when user does not have permission', async () => {
    const response = await request(app)
      .delete('/api/posts/101')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 when post does not exist', async () => {
    const response = await request(app)
      .delete('/api/posts/99999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: 'Post not found.',
    });
  });
})