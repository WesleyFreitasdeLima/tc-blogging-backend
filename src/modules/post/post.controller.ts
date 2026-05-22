import type { Request, Response } from "express";
import type { Post } from "./post.entity.js";
import PostService from "./post.service.js";

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

  getPostById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
       
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const post: Post | undefined = this.postService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ 
        message: "Post retrieved successfully",
        data: post
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while retrieving the post" });
    }
  }
}

export { PostController };