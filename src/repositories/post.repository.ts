import type { Repository } from "typeorm";

import type { IPostRepository } from "./interface/post-repository.interface.js";
import { appDataSource } from "../database/typeorm.js";
import { Post } from "../entities/post.entity.js";
import { AppNotFound } from "../erros/not-found.js";

class PostRepository implements IPostRepository {
  private postRepository: Repository<Post>;

  constructor() {
    this.postRepository = appDataSource.getRepository(Post);
  }
  async getPosts(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<Post[]> {
    const query = this.postRepository.createQueryBuilder("post");

    if (search) {
      query.andWhere(
        `
        post.title ILIKE :search
        OR post.content ILIKE :search
      `,
        {
          search: `%${search}%`,
        },
      );
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.postRepository.findOne({
      where: { id },
    });
  }

  async createPost(
    post: Partial<Omit<Post, "id" | "updatedAt" | "updatedBy">>,
  ): Promise<Post> {
    post.createdAt = new Date();
    post.isActive = true;
    const entity = this.postRepository.create(post);

    return this.postRepository.save(entity);
  }

  async editPostById(
    id: number,
    post: Partial<Omit<Post, "id" | "createdAt" | "createdBy">>,
  ): Promise<Post> {
    const existingPost = await this.postRepository.findOne({
      where: { id },
    });

    if (!existingPost) {
      throw new AppNotFound("post");
    }

    post.updatedAt = new Date();

    const updatedPost = this.postRepository.merge(existingPost, post);

    return this.postRepository.save(updatedPost);
  }

  async deletePostById(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);

    if (!result.affected) {
      throw new AppNotFound("post");
    }
  }
}

export default PostRepository;
