import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";

describe("POST /api/posts", () => {
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

  it('should create a post successfully', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'My first post',
        content: 'Post content',
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: 'Post created successfully',
      data: {
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
        createdBy: {
          id: expect.any(Number),
          name: expect.any(String)
        },
        updatedBy: null,
        isActive: expect.any(Boolean)
      }
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({
        title: 'My first post',
        content: 'Post content',
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: 'Missing or invalid authorization header',
    });
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        title: 'My first post',
        content: 'Post content',
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: 'Invalid or expired token',
    });
  });

  it('should return 403 when user does not have permission', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'My first post', content: 'Post content' });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: 'Forbidden: insufficient permissions',
    });
  });

  it('should return 400 when title is not provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        content: 'Post content',
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: 'Validation error',
      errors: [
        {
          field: "title",
          message: "Invalid input: expected string, received undefined"
        }
      ]
    });
  });

  it('should return 400 when content is not provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Post title',
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: 'Validation error',
      errors: [
        {
          field: "content",
          message: "Invalid input: expected string, received undefined"
        }
      ]
    });
  });
})