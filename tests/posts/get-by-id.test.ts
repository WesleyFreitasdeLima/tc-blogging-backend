import { beforeEach, describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from '../_factories/user.factory';
import { UserRoleEnum } from '../../src/enum/user-role.enum';
import { PostFactory } from '../_factories/post.factory';

describe("GET /api/posts/:id", () => {
  let teacherId: number;

  beforeEach(async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });
    teacherId = teacher.id!
  });

  it('should return a post with the expected structure', async () => {
    const post = await PostFactory.create(teacherId, { title: 'Introduction to JavaScript' });

    const response = await request(app).get(`/api/posts/${post.id}`);

    expect(response.status).toBe(200);

    expect(response.body.data).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      content: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('should return 404 when the post does not exist', async () => {
    const response = await request(app).get('/api/posts/999999');

    expect(response.status).toBe(404);

    expect(response.body).toEqual({ message: 'Post not found.' });
  });

  it('should return 400 when the id is invalid', async () => {
    const response = await request(app).get('/api/posts/abc');

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      "message": "Validation error"
    })
  });
})