import { beforeEach, describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from '../_factories/user.factory';
import { UserRoleEnum } from '../../src/enum/user-role.enum';
import { PostFactory } from '../_factories/post.factory';

describe("GET /api/posts/", () => {
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
    const response = await request(app).get('/api/posts/');

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

  it('should return only 1 posts when limit is 1', async () => {
    const response = await request(app).get('/api/posts?page=1&limit=1');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('should return 200 when page is invalid', async () => {
    const response = await request(app)
      .get('/api/posts?page=0&limit=10');

    expect(response.status).toBe(200);
  });
})