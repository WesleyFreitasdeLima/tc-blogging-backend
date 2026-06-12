import { describe, expect, it } from '@jest/globals';

import request from "supertest";
import app from "../../src/app";

describe("GET /health", () => {
  it("should return HTTP 200 OK", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
  });
});
