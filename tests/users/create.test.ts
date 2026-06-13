import { beforeAll, describe, it, expect } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";

describe("POST /api/users", () => {
  let adminToken: string;

  beforeAll(async () => {
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: 'admin', password: '123456' });

    adminToken = adminLogin.body.data.accessToken;
  });

  it('should create a user successfully', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: '123456',
        role: 'teacher',
      });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: 'User created successfully',
      data: {
        id: expect.any(Number),
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        role: 'user',
        createdAt: expect.any(String),
        isActive: true
      },
    });
  });

  it('should return 400 when username already exists', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin',
        username: 'admin',
        email: 'new@email.com',
        password: '123456',
        role: 'teacher',
      });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      "message": "Username or email already exists."
    })
  });

  it('should return 400 when email already exists', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin',
        username: 'admin',
        email: 'john@example.com',
        password: '123456',
        role: 'teacher',
      });

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      "message": "Username or email already exists."
    })
  });

  it('should return users with the expected structure', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    expect(response.body.data[0]).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      role: expect.any(String),
      createdAt: expect.any(String),
      isActive: expect.any(Boolean),
    });
  });
})