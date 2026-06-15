import { describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";

describe("GET /api/posts/", () => {
  it('should return posts with the expected structure', async () => {
    const response = await request(app).get('/api/posts?page=1&limit=10');

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

  it('should return 500 when page is invalid', async () => {
    const response = await request(app)
      .get('/api/posts?page=0&limit=10');

    expect(response.status).toBe(500);
  });
})