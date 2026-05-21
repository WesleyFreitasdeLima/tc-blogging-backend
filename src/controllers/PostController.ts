import type { Request, Response } from "express";
import type { Post } from "../models/Post.js";

class PostController {
  static getAllPosts(req: Request, res: Response): Response {
    try {
      const posts: Post[] = [
            { id: 1, title: "Primeiros passos com Express", content: "Express é uma ferramenta incrível...", author: "Dev" },
            { id: 2, title: "Dominando o MVC", content: "Arquitetura limpa facilita muito a manutenção...", author: "Dev" }
        ];

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