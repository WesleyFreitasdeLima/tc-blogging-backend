import { describe, it, expect, beforeAll } from "@jest/globals"
import request from "supertest";

import app from "../../src/app";

describe("PUT /api/users/me", () => {
  let userToken: string;

  beforeAll(async () => {
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'inative_user', password: '123456' });

    userToken = userLogin.body.data.accessToken;
  });

  it('should update authenticated user data', async () => {
    const response = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Updated User Name',
      });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: 'User updated successfully',
      data: {
        name: 'Updated User Name',
      },
    });
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      message: "Validation error",
      errors: [
        {
          field: "",
          message: "Please provide at least one field for updating."
        }
      ]
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .put('/api/users/me')
      .send({
        name: 'Updated User Name',
      });

    expect(response.status).toBe(401);
  });
})