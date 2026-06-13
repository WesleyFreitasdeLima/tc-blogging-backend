import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";

describe("PUT /api/posts", () => {
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

  it('should update a post successfully', async () => {
    const response = await request(app)
      .put('/api/posts/99')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated title',
        content: 'Updated content',
      });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: 'Post updated successfully',
      data: {
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
        createdBy: null,
        updatedBy: {
          id: expect.any(Number),
          name: expect.any(String)
        },
        isActive: expect.any(Boolean)
      },
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .put('/api/posts/99')
      .send({
        title: 'Updated title',
        content: 'Updated content',
      });

    expect(response.status).toBe(401);
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .put('/api/posts/1')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        title: 'Updated title',
        content: 'Updated content',
      });

    expect(response.status).toBe(401);
  });

  it('should return 403 when user does not have permission', async () => {
    const response = await request(app)
      .put('/api/posts/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Updated title',
        content: 'Updated content',
      });

    expect(response.status).toBe(403);
  });

  it('should return 404 when post does not exist', async () => {
    const response = await request(app)
      .put('/api/posts/99999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated title',
        content: 'Updated content',
      });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: 'Post not found.',
    });
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .put('/api/posts/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(response.status).toBe(400);
    
    expect(response.body).toEqual({
      message: "Validation error",
      errors: [
        {
          field: "",
          message: "Informe ao menos um campo para atualização."
        }
      ]
    });
  });
})