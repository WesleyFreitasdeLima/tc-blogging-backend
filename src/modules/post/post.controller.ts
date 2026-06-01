import type { Request, Response } from "express";
import type { Post } from "./post.entity.js";
import PostService from "./post.service.js";
import z from "zod";
import type { IPost } from "./interfaces/post.interface.js";
import type UserService from "../user/user.service.js";
import { AppNotFound } from "../../erros/not-found.js";

const creatPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const updatePostSchema = creatPostSchema
  .extend({
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

const idParamschema = z.object({
  id: z.coerce.number(),
});

const registerQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
});
class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async getAllPosts(req: Request, res: Response): Promise<Response> {
    const { page, limit } = registerQuerySchema.parse(req.query);

    const posts: IPost[] = await this.postService.getAllPosts(page, limit);

    return res.status(200).json({
      message: "All posts retrieved successfully",
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

  async getPostById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);

    const post: IPost | null = await this.postService.getPostById(id);

    if (!post) {
      throw new AppNotFound("Post");
    }

    return res.status(200).json({
      message: "Post retrieved successfully",
      data: {
        ...post,
        createdBy: post.createdBy
          ? { id: post.createdBy.id, name: post.createdBy.name }
          : null,
        updatedBy: post.updatedBy
          ? { id: post.updatedBy.id, name: post.updatedBy.name }
          : null,
      },
    });
  }

  async searchPostsByKeywords(req: Request, res: Response): Promise<Response> {
    const { page, limit, search } = registerQuerySchema.parse(req.query);
    console.log("Query " + req.query);
    const posts: IPost[] = await this.postService.getAllPosts(
      page,
      limit,
      search,
    );

    return res.status(200).json({
      message: "Posts retrieved successfully",
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

  async createPost(req: Request, res: Response): Promise<Response> {
    const data = creatPostSchema.parse(req.body);
    const idUser = req.user!.sub;

    const user = await this.userService.getUserById(idUser);

    if (!user) {
      throw new AppNotFound("author");
    }

    const post = Object.assign(data, {
      createdBy: user,
    });

    const newPost = await this.postService.createPost(post);

    return res.status(201).json({
      message: "Post created successfully",
      data: {
        ...newPost,
        createdBy: newPost.createdBy
          ? { id: newPost.createdBy.id, name: newPost.createdBy.name }
          : null,
        updatedBy: newPost.updatedBy
          ? { id: newPost.updatedBy.id, name: newPost.updatedBy.name }
          : null,
      },
    });
  }

  async editPostById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);
    const data = updatePostSchema.parse(req.body);
    const idUser = req.user!.sub;

    const user = await this.userService.getUserById(idUser);

    if (!user) {
      throw new AppNotFound("author");
    }

    const post = Object.assign(data, {
      updatedAt: new Date(),
      updatedBy: user,
    });

    const updatedPost = await this.postService.editPostById(id, post);

    if (!updatedPost) {
      throw new AppNotFound("Post");
    }

    return res.status(200).json({
      message: "Post updated successfully",
      data: {
        ...updatedPost,
        createdBy: updatedPost.createdBy
          ? { id: updatedPost.createdBy.id, name: updatedPost.createdBy.name }
          : null,
        updatedBy: updatedPost.updatedBy
          ? { id: updatedPost.updatedBy.id, name: updatedPost.updatedBy.name }
          : null,
      },
    });
  }

  async deletePostById(req: Request, res: Response): Promise<Response> {
    const { id } = idParamschema.parse(req.params);

    const deleted = await this.postService.deletePostById(id);

    if (!deleted) {
      throw new AppNotFound("Post");
    }

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  }
}

export { PostController };
