import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { registerPost } from "../_helpers/register-entity";

describe("POST /api/posts", () => {
  let userToken: string;
  let teacherToken: string;

  beforeEach(async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: teacher.username, password: '123456' });

    teacherToken = teacherLogin.body.data.accessToken;
  });

  it('should create a post successfully', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'My first post', content: 'Test post successfully' });

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

    registerPost(response.body.data.id);
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({ title: 'My first post', content: 'Post content' });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: 'Missing or invalid authorization header',
    });
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', 'Bearer invalid-token')
      .send({ title: 'My first post', content: 'Post content' });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      message: 'Invalid or expired token',
    });
  });

  it('should return 400 when title is not provided', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ content: 'Post content' });

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
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'Post title' });

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