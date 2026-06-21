import { randomUUID } from "crypto";

import { appDataSource } from "../../src/database/typeorm";
import { Post } from "../../src/modules/post/post.entity";
import { TestContext } from "../_helpers/test-context";

export class PostFactory {
  static async create(authorId: number, { ...overrides}: Partial<Post> = {}) {
    const repository = appDataSource.getRepository(Post);

    const post = repository.create({
      title: `Post ${randomUUID()}`,
      content: 'Post criado para teste',
      createdBy: { id: authorId },
      isActive: true,
      ...overrides
    });

    const savedPost = await repository.save(post);

    TestContext.posts.push(savedPost.id!);

    return savedPost;
  }
}