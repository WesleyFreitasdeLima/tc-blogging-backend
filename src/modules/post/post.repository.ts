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

  searchKeywords(keywords: string[]): Post[] {
    const lowerCaseKeywords = keywords.map(k => k.toLowerCase());
    return this.db.filter(post => 
      lowerCaseKeywords.some(keyword => 
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
      )
    );
  }

  editById(id: number, updatedFields: Partial<Omit<Post, "id">>): Post | undefined {
    const post = this.findById(id);
    if (post) {
      Object.assign(post, updatedFields);
      return post;
    }
    return undefined;
  }

  deleteById(id: number): boolean {
    const index = this.db.findIndex(post => post.id === id);
    if (index !== -1) {
      this.db.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default PostRepository;
