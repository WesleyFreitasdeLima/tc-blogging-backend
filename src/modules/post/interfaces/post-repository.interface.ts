import type { IPost } from "./post.interface.js";


export interface IPostRepository {
  findAll(
    page: number,
    limit: number,
    search: string | undefined,
  ): Promise<IPost[]>;
  findById(id: number): Promise<IPost | null>;
  create(post: IPost): Promise<IPost>;
  editById(id: number, post: IPost): Promise<IPost>;
  deleteById(id: number): Promise<boolean>;
}
