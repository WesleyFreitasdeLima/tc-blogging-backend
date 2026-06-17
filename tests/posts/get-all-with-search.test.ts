import { beforeEach, describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";
import { PostFactory } from '../_factories/post.factory';
import { UserRoleEnum } from '../../src/enum/user-role.enum';
import { UserFactory } from '../_factories/user.factory';

describe("GET /api/posts/search", () => {
  beforeEach(async () => {
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    if (!teacher.id) throw new Error('Teacher ID is undefined')

    await Promise.all([
      PostFactory.create(teacher.id, { title: 'Node.js for Beginners' }),
      PostFactory.create(teacher.id, { title: 'Advanced Node.js Concepts' }),
      PostFactory.create(teacher.id, { title: 'Introduction to JavaScript' }),
    ]);
  });

  it('should return posts with the expected structure', async () => {
    const response = await request(app).get('/api/posts/search?search=node');

    expect(response.status).toBe(200);

    response.body.data.forEach((post: any) => {
      expect(post).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(String),
      });
    });
  });

  it('should return an empty array when no posts match the search term', async () => {
    const response = await request(app)
      .get('/api/posts/search?page=1&limit=10&search=xxxxxxxxxxxxxxxx');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'Posts retrieved successfully',
      data: [],
    });
  });

  it('should return 400 when page is invalid', async () => {
    const response = await request(app).get('/api/posts/search?page=aaaa&limit=10&search=node');

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      message: "Validation error",
      errors: [
        {
          field: "page",
          message: "Invalid input: expected number, received NaN"
        }
      ]
    });
  });

  it('should return 400 when limit is invalid', async () => {
    const response = await request(app).get('/api/posts/search?page=1&limit=aaaa&search=node');

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      message: "Validation error",
      errors: [
        {
          field: "limit",
          message: "Invalid input: expected number, received NaN"
        }
      ]
    });
  });
})