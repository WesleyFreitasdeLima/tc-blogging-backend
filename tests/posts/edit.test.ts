import { beforeAll, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { PostFactory } from "../_factories/post.factory";

describe("PUT /api/posts", () => {
  let teacherToken: string;
  let teacherId: number;

  beforeEach(async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: teacher.username, password: '123456' });

    teacherId = teacher.id!;
    teacherToken = teacherLogin.body.data.accessToken;
  });

  it('should update a post successfully', async () => {
    const post = await PostFactory.create(teacherId);

    const response = await request(app)
      .put(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${teacherToken}`)
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
      .put('/api/posts/999999')
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

  it('should return 404 when post does not exist', async () => {
    const response = await request(app)
      .put('/api/posts/99999999')
      .set('Authorization', `Bearer ${teacherToken}`)
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
      .set('Authorization', `Bearer ${teacherToken}`)
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