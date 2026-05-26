import type { IPost } from "../../entities/interfaces/post.interface.js";

export interface IPostRepository {
  getPosts(
    page: number,
    limit: number,
    search: string | undefined,
  ): Promise<IPost[]>;
  getPostById(id: number): Promise<IPost | null>;
  createPost(post: IPost): Promise<IPost>;
  editPostById(id: number, post: IPost): Promise<IPost>;
  deletePostById(id: number): Promise<void>;
}
