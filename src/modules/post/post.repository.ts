import type { Post } from "./post.entity.js";
import { database } from "../../database/database-config.service.js";

class PostRepository {
  private readonly db: Post[] = database as Post[];

  create(post: Omit<Post, "id">): Post {
    const id = this.db.length ? Math.max(...this.db.map((p) => p.id)) + 1 : 1;
    const newPost: Post = { id, ...post };
    this.db.push(newPost);
    return newPost;
  }

  findAll(): Post[] {
    return [...this.db];
  }

  findById(id: number): Post | undefined {
    return this.db.find(post => post.id === id);
  }
}

export default PostRepository;
