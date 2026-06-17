import { beforeEach, describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";
import { UserRoleEnum } from '../../src/enum/user-role.enum';
import { UserFactory } from '../_factories/user.factory';
import { randomUUID } from 'crypto';

describe('POST /api/auth/login', () => {
  let user: { password: string; username: string };
  let inativeUser: { password: string; username: string };

  beforeEach(async () => {
    const newUser = await UserFactory.create({ role: UserRoleEnum.TEACHER });
    const newInativeUser = await UserFactory.create({ role: UserRoleEnum.TEACHER, isActive: false });

    user = { username: newUser.username, password: '123456' };
    inativeUser = { username: newInativeUser.username, password: '123456' }
  });

  it('should authenticate the user when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username, password: user.password });
    
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: 'Login successful',
      data: { accessToken: expect.any(String) },
    });

    expect(response.body.data.accessToken.split('.')).toHaveLength(3);
  });

  it('should return 400 when request body is empty', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({ message: "Login or Password invalid." })
  });

  it('should return 400 when the user does not exist', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ login: randomUUID(), password: '123456' });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({ message: "Login or Password invalid." })
  });

  it('should return 400 when the password is incorrect', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username, password: 'pass' });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({ message: "Login or Password invalid." })
  });

  it('should return 400 when the login is not provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: user.password });

    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({ message: "Login or Password invalid." })
  });

  it('should return 400 when the password is not provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({ message: "Login or Password invalid." })
  });

  it('should return 400 when the user account is inactive', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ login: inativeUser.username, password: inativeUser.password });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Account inactive. Please contact your administrator."
    })
  });
});
