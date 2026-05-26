import type { Request, Response } from "express";
import PostService from "../../../services/post.service.js";
import { Post } from "../../../entities/post.entity.js";
import UserService from "../../../services/user.service.js";
import { AppNotFound } from "../../../erros/not-found.js";

class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async createPost(req: Request, res: Response) {
    const { title, content, createdBy } = req.body;

    if (!title || !content || !createdBy) {
      return res
        .status(400)
        .json({ message: "Title, and content are required" });
    }

    const user = await this.userService.getUserById(createdBy);

    if (!user) throw new AppNotFound("createdBy");

    const newPost: Post = await this.postService.createPost({
      title: title,
      content: content,
      createdBy: user,
    });

    return res.status(201).json({
      message: "Post created successfully",
      data: newPost,
    });
  }

  async getAllPosts(req: Request, res: Response) {
    const posts: Post[] = await this.postService.getPosts();

    return res.status(200).json({
      message: "All posts retrieved successfully",
      data: posts,
    });
  }
}

export { PostController };
