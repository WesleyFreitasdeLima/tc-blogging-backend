import type { Request, Response } from "express";
import z from "zod";
import type { IComent } from "./interfaces/coment.interface.js";
import type UserService from "../user/user.service.js";
import { AppNotFound } from "../../erros/not-found.js";
import type ComentService from "./coment.service.js";
import type PostService from "../post/post.service.js";

const idParamschema = z.object({
  id: z.coerce.number(),
});

const creatComenttSchema = z.object({
  post: z.int(),
  content: z.string(),
});

const updateComentSchema = creatComenttSchema
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
class ComentController {
  constructor(
    private readonly comentService: ComentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async getAllComent(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);
    const { page, limit } = registerQuerySchema.parse(req.query);

    const posts: IComent[] = await this.comentService.getAllComents(
      id,
      page,
      limit,
    );

    return res.status(200).json({
      message: "All coments retrieved successfully",
      data: posts.map((post) => ({
        ...post,
        createdBy: post.createdBy
          ? { id: post.createdBy.id, name: post.createdBy.name }
          : null,
        updatedBy: post.updatedBy
          ? { id: post.updatedBy.id, name: post.updatedBy.name }
          : null,
      })),
    });
  }

  async getComentById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);

    const coment: IComent | null = await this.comentService.getComentById(id);

    if (!coment) {
      throw new AppNotFound("Coment");
    }
    return res.status(200).json({
      message: "Coment retrieved successfully",
      data: {
        ...coment,
        createdBy: coment.createdBy
          ? { id: coment.createdBy.id, name: coment.createdBy.name }
          : null,
        updatedBy: coment.updatedBy
          ? { id: coment.updatedBy.id, name: coment.updatedBy.name }
          : null,
      },
    });
  }

  async createComent(req: Request, res: Response): Promise<Response> {
    const data = creatComenttSchema.parse(req.body);
    const idUser = req.user!.sub;

    const user = await this.userService.getUserById(idUser);

    if (!user) {
      throw new AppNotFound("author");
    }

    const post = await this.postService.getPostById(data.post);

    if (!post) {
      throw new AppNotFound("Post");
    }
    const coment = Object.assign(data, {
      post: post,
      createdBy: user,
    });

    const newComent = await this.comentService.createComent(coment);

    return res.status(201).json({
      message: "Coment created successfully",
      data: {
        ...newComent,
        createdBy: newComent.createdBy
          ? { id: newComent.createdBy.id, name: newComent.createdBy.name }
          : null,
        updatedBy: newComent.updatedBy
          ? { id: newComent.updatedBy.id, name: newComent.updatedBy.name }
          : null,
      },
    });
  }

  async editComentById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);
    const data = updateComentSchema.parse(req.body);
    const idUser = req.user!.sub;

    const user = await this.userService.getUserById(idUser);

    if (!user) {
      throw new AppNotFound("author");
    }

    const coment = Object.assign(data, {
      updatedAt: new Date(),
      updatedBy: user,
    });

    const updatedComent = await this.comentService.editComentById(id, coment);

    if (!updatedComent) {
      throw new AppNotFound("Coment");
    }

    return res.status(200).json({
      message: "Coment updated successfully",
      data: {
        ...updatedComent,
        createdBy: updatedComent.createdBy
          ? {
              id: updatedComent.createdBy.id,
              name: updatedComent.createdBy.name,
            }
          : null,
        updatedBy: updatedComent.updatedBy
          ? {
              id: updatedComent.updatedBy.id,
              name: updatedComent.updatedBy.name,
            }
          : null,
      },
    });
  }

  async deleteComentById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);

    const deleted = await this.comentService.deleteComentById(id);

    if (!deleted) {
      throw new AppNotFound("Coment");
    }

    return res.status(200).json({
      message: "Coment deleted successfully",
    });
  }
}

export { ComentController };
