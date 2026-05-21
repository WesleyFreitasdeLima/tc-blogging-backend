import type { Request, Response } from "express";
import type { Post } from "../models/Post.js";
import PostService from "../services/PostService.js";

class PostController {
  static getAllPosts(req: Request, res: Response): Response {
    try {
      const posts: Post[] = PostService.getAllPosts();

      return res.status(200).json({ 
        message: "All posts retrieved successfully",
        data: posts
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while retrieving posts" });
    }
  }
}

export { PostController };