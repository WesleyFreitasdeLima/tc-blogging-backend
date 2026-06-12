import { describe, expect, it } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";

describe('POST /auth/login', () => {
  it('should authenticate the user when valid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'admin',
        password: '123456',
      });
    
    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      message: 'Login successful',
      data: {
        accessToken: expect.any(String),
      },
    });

    expect(response.body.data.accessToken.split('.')).toHaveLength(3);
  });

  it('should return 400 when request body is empty', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      "message": "Login or Password invalid."
    })
  });

  it('should return 400 when the user does not exist', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'usu',
        password: '123456',
      });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Login or Password invalid."
    })
  });

  it('should return 400 when the password is incorrect', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'admin',
        password: 'pass',
      });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Login or Password invalid."
    })
  });

  it('should return 400 when the login is not provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'pass',
      });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Login or Password invalid."
    })
  });

  it('should return 400 when the password is not provided', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'admin',
      });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Login or Password invalid."
    })
  });

  it('should return 400 when the user account is inactive', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'inative_user',
        password: '123456'
      });
    
    expect(response.status).toBe(400)
    
    expect(response.body).toMatchObject({
      "message": "Account inactive. Please contact your administrator."
    })
  });
});
