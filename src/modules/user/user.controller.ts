import type { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import z from "zod";
import { UserRoleEnum } from "../../enum/user-role.enum.js";
import { AppAuthNegate } from "../../erros/autth.js";
import { AppNotFound } from "../../erros/not-found.js";
import { AppRegraNegocio } from "../../erros/regra-negocio.js";
import type { IUser } from "./interfaces/user.interface.js";
import type UserService from "./user.service.js";

const createUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string(),
  role: z.enum(UserRoleEnum),
});

const updateUserSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Please provide at least one field for updating.",
  })
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    ),
  );

const updateTeacherSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    isActive: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualização.",
  })
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    ),
  );

const registerQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .transform((page) => Math.max(1, page))
    .default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
});
class UserController {
  constructor(private readonly userService: UserService) {}

  private checkUser(user: IUser | null): IUser {
    if (!user || user?.role === UserRoleEnum.ADMIN) {
      throw new AppNotFound("Registro não encontrado");
    }

    return user;
  }
  private getTermo(role: UserRoleEnum): string {
    let termo = "";

    switch (role) {
      case UserRoleEnum.ADMIN:
        termo = "admin";
        break;
      case UserRoleEnum.TEACHER:
        termo = "Teacher";
        break;
      case UserRoleEnum.STUDENT:
        termo = "Student";
        break;

      default:
        break;
    }

    return termo;
  }
  async getUserById(req: Request, res: Response): Promise<Response> {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    let user = await this.userService.getUserById(id);

    user = this.checkUser(user);

    const { password, ...data } = user;

    return res.status(200).json({
      message: `${this.getTermo(user.role)} retrieved successfully`,
      data,
    });
  }

  async editUserById(req: Request, res: Response): Promise<Response> {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    const data = updateTeacherSchema.parse(req.body);
    let existingUser = await this.userService.getUserById(id);

    existingUser = this.checkUser(existingUser);

    try {
      const updatedUser = await this.userService.editUserById(id, data);
      const { password, ...userData } = updatedUser;

      return res.status(200).json({
        message: `${this.getTermo(existingUser.role)} updated successfully`,
        data: userData,
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === "23505"
      ) {
        throw new AppRegraNegocio("Username or email already exists.");
      }
      throw error;
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<Response> {
    const id = z.coerce.number().int().positive().parse(req.params.id);
    let user = await this.userService.getUserById(id);

    user = this.checkUser(user);

    try {
      await this.userService.deleteUserById(id);

      return res.status(200).json({
        message: `${this.getTermo(user.role)} deleted successfully`,
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === "23503"
      ) {
        throw new AppRegraNegocio("Teacher with related posts.");
      }
      throw error;
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    const registerQuerySchema = z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
      role: z.coerce.string().default(""),
    });

    const { page, limit, role } = registerQuerySchema.parse(req.query);

    let users: IUser[] = await this.userService.getAllUsers(page, limit, role);

    if (
      !req.user ||
      (req.user.role !== UserRoleEnum.ADMIN &&
        (role === "" || role !== UserRoleEnum.ADMIN))
    ) {
      users = users.filter((item) => {
        return item.role != UserRoleEnum.ADMIN;
      });
    }

    return res.status(200).json({
      message: "All users retrieved successfully",
      data: users.map(({ password, ...rest }) => rest),
    });
  }

  async getMe(req: Request, res: Response): Promise<Response> {
    const id = req.user?.sub;

    if (!id) {
      throw new AppAuthNegate("Missing authenticated user");
    }

    const user: IUser | null = await this.userService.getUserById(id);

    if (!user) {
      throw new AppNotFound("User");
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: (({ password, ...rest }) => rest)(user),
    });
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const data = createUserSchema.parse(req.body);
    try {
      const newUser = await this.userService.createUser(data);

      return res.status(201).json({
        message: "User created successfully",
        data: (({ password, ...rest }) => rest)(newUser),
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === "23505"
      ) {
        throw new AppRegraNegocio("Username or email already exists.");
      }
      throw error;
    }
  }

  async editMe(req: Request, res: Response): Promise<Response> {
    const id = req.user?.sub;

    if (!id) {
      throw new AppAuthNegate("Missing authenticated user");
    }

    const data = updateUserSchema.parse(req.body);

    try {
      const updatedUser = await this.userService.editUserById(id, data);

      return res.status(200).json({
        message: "User updated successfully",
        data: (({ password, ...rest }) => rest)(updatedUser),
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === "23505"
      ) {
        throw new AppRegraNegocio("Username or email already exists.");
      }
      throw error;
    }
  }

  async deleteMe(req: Request, res: Response): Promise<Response> {
    const id = req.user?.sub;

    if (!id) {
      throw new AppAuthNegate("Missing authenticated user");
    }

    try {
      const deleted = await this.userService.deleteUserById(id);

      if (!deleted) {
        throw new AppNotFound("User");
      }

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === "23503"
      ) {
        throw new AppRegraNegocio("User with related posts.");
      }
      throw error;
    }
  }
}

export default UserController;
