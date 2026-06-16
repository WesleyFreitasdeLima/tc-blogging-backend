import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { UserFactory } from "../_factories/user.factory";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { PostFactory } from "../_factories/post.factory";

describe("DELETE /api/posts", () => {
  let userToken: string;
  let teacherToken: string;
  let teacherId: number;

  beforeEach(async () => {
    const user = await UserFactory.create({ role: UserRoleEnum.USER });
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: user.username, password: '123456' });

    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({ login: teacher.username, password: '123456' });

    teacherId = teacher.id!;
    userToken = userLogin.body.data.accessToken;
    teacherToken = teacherLogin.body.data.accessToken;
  });

  it('should delete a post successfully', async () => {
    const post = await PostFactory.create(teacherId, { title: 'Post to be deleted' });

    const response = await request(app)
      .delete(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: 'Post deleted successfully',
    });
  });

  it('should return 401 when token is not provided', async () => {
    const response = await request(app)
      .delete('/api/posts/999999');

    expect(response.status).toBe(401);
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .delete('/api/posts/999999')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  it('should return 403 when user does not have permission', async () => {
    const post = await PostFactory.create(teacherId, { title: 'Post not have permission' });

    const response = await request(app)
      .delete(`/api/posts/${post.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  it('should return 404 when post does not exist', async () => {
    const response = await request(app)
      .delete('/api/posts/99999999')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      message: 'Post not found.',
    });
  });
})