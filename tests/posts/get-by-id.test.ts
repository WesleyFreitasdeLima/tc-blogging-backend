import { describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";

describe("GET /api/posts/:id", () => {
  it('should return a post with the expected structure', async () => {
    const response = await request(app).get('/api/posts/99');

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