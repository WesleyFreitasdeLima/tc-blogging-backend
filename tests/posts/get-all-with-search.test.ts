import { describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";

describe("GET /api/posts/search", () => {
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
})