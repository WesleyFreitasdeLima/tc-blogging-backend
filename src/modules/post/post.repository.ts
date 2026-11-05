import type { Repository } from "typeorm";
import { appDataSource } from "../../database/typeorm.js";
import type { IPostRepository } from "./interfaces/post-repository.interface.js";
import type { IPost } from "./interfaces/post.interface.js";
import { Post } from "./post.entity.js";
import { AppNotFound } from "../../erros/not-found.js";

class PostRepository implements IPostRepository {
  private postRepository: Repository<IPost>;

  constructor() {
    this.postRepository = appDataSource.getRepository(Post);
  }

  async findAll(
    page: number,
    limit: number,
    search: string | undefined = undefined,
  ): Promise<IPost[]> {
    const query = this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.createdBy", "postCreatedBy")
      .leftJoinAndSelect("post.updatedBy", "postUpdatedBy");

    if (search) {
      query.andWhere(
        `
      post.title ILIKE :search
      OR post.content ILIKE :search
      OR postCreatedBy.name ILIKE :search
    `,
        { search: `%${search}%` },
      );
    }

    return query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findById(id: number): Promise<IPost | null> {
    return await this.postRepository.findOne({
      where: { id: id },
      relations: [
        "createdBy",
        "updatedBy",
        "coments",
        "coments.createdBy",
        "coments.updatedBy",
      ],
    });
  }

  create(user: Omit<IPost, "id">): Promise<IPost> {
    const entity = this.postRepository.create(user);

    return this.postRepository.save(entity);
  }

  async editById(
    id: number,
    updatedFields: Partial<Omit<IPost, "id">>,
  ): Promise<IPost> {
    const existingPost = await this.postRepository.findOne({
      where: { id },
    });

    if (!existingPost) {
      throw new AppNotFound("Post");
    }

    Object.assign(existingPost, updatedFields);

    return this.postRepository.save(existingPost);
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.postRepository.delete(id);

    if (!result.affected) {
      return false;
    }

    return result.affected > 0;
  }
}

export default PostRepository;
