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

  searchPostsByKeywords(req: Request, res: Response): Response {
    try {
      const { keywords } = req.query;

      if (!keywords || typeof keywords !== "string") {
        return res.status(400).json({ message: "Keywords are required" });
      }

      const keywordsArray = keywords.split(",").map(k => k.trim());
      const posts: Post[] = this.postService.searchPostsByKeywords(keywordsArray);

      return res.status(200).json({ 
        message: "Posts retrieved successfully",
        data: posts
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while searching posts" });
    }
  }

  editPostById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
      const { title, content, author } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const updatedFields: Partial<Omit<Post, "id">> = {};
      if (title) updatedFields.title = title;
      if (content) updatedFields.content = content;
      if (author) updatedFields.author = author;

      const updatedPost: Post | undefined = this.postService.editPostById(id, updatedFields);

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ 
        message: "Post updated successfully",
        data: updatedPost
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while updating the post" });
    }
  }

  deletePostById(req: Request, res: Response): Response {
    try {
      const id = parseInt(req.params.id ?? "", 10);
       
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }

      const deleted = this.postService.deletePostById(id);

      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ 
        message: "Post deleted successfully"
      });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while deleting the post" });
    }
  }
}

export { PostController };