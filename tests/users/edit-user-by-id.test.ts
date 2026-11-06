import { beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { UserRoleEnum } from "../../src/enum/user-role.enum";
import { UserFactory } from "../_factories/user.factory";

describe("GET, PUT and DELETE /api/users/:id", () => {
  let adminToken: string;
  let teacherId: number;
  let targetTeacherId: number;
  let adminId: number;
  let teacherToken: string;

  beforeEach(async () => {
    const admin = await UserFactory.create({ role: UserRoleEnum.ADMIN });
    const teacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });
    const targetTeacher = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    adminId = admin.id!;
    teacherId = teacher.id!;
    targetTeacherId = targetTeacher.id!;

    const [adminLogin, teacherLogin] = await Promise.all([
      request(app)
        .post("/api/auth/login")
        .send({ login: admin.username, password: "123456" }),
      request(app)
        .post("/api/auth/login")
        .send({ login: teacher.username, password: "123456" }),
    ]);

    adminToken = adminLogin.body.data.accessToken;
    teacherToken = teacherLogin.body.data.accessToken;
  });

  it("allows an admin to retrieve a teacher without exposing the password", async () => {
    const response = await request(app)
      .get(`/api/users/${teacherId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: teacherId,
      role: UserRoleEnum.TEACHER,
    });
    expect(response.body.data.password).toBeUndefined();
  });

  it("allows an admin to update a teacher", async () => {
    const response = await request(app)
      .put(`/api/users/${teacherId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Teacher Name" });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: teacherId,
      name: "Updated Teacher Name",
      role: UserRoleEnum.TEACHER,
    });
    expect(response.body.data.password).toBeUndefined();
  });

  it("does not allow changing an admin through teacher endpoints", async () => {
    const response = await request(app)
      .put(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Changed Admin" });

    expect(response.status).toBe(404);
  });

  it("allows a teacher to retrieve a user", async () => {
    const response = await request(app)
      .get(`/api/users/${targetTeacherId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: targetTeacherId,
      role: UserRoleEnum.TEACHER,
    });
    expect(response.body.data.password).toBeUndefined();
  });

  it("allows an admin to delete a teacher", async () => {
    const response = await request(app)
      .delete(`/api/users/${targetTeacherId}`) // Admin deletando o targetTeacher
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Teacher deleted successfully" });
  });

  it("does not allow deleting an admin through the teacher endpoint", async () => {
    const response = await request(app)
      .delete(`/api/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
  });

  it("allows a teacher to delete ANOTHER user", async () => {
    // Cria um usuário novo isolado apenas para este teste, para não conflitar com outros testes
    const userToDelete = await UserFactory.create({ role: UserRoleEnum.TEACHER });

    const response = await request(app)
      .delete(`/api/users/${userToDelete.id}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(response.status).toBe(200);
  });

  it("does not allow a teacher to delete THEMSELVES", async () => {
    const response = await request(app)
      .delete(`/api/users/${teacherId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(response.status).toBe(403);
  });
});