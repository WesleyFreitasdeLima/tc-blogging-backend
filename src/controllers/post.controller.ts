import type { Request, Response } from "express";
import type { Post } from "../models/post.entity.js";
import PostService from "../services/post.service.js";

class PostController {
  constructor(private readonly postService: PostService) {}

  createPost(req: Request, res: Response): Response {
    try {
      const { title, content, author } = req.body;

      if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content, and author are required" });
      }

      const newPost: Post = this.postService.createPost(title, content, author);

      return res.status(201).json({ 
        message: "Post created successfully",
        data: newPost
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while creating the post" });
    }
  }
  
  getAllPosts(req: Request, res: Response): Response {
    try {
      const posts: Post[] = this.postService.getAllPosts();

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