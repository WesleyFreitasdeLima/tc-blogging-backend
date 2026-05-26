import { Post } from "../entities/post.entity.js";
import PostRepository from "../repositories/post.repository.js";

class PostService {
  constructor(private readonly postRepository: PostRepository) {
    this.postRepository = new PostRepository();
  }

  async getPosts(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined,
  ): Promise<Post[]> {
    return await this.postRepository.getPosts(page, limit, search);
  }

  async getPostById(id: number): Promise<Post | null> {
    return await this.postRepository.getPostById(id);
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    return await this.postRepository.createPost(post);
  }

  async editPostById(id: number, post: Partial<Post>): Promise<Post> {
    return this.postRepository.editPostById(id, post);
  }

  async deletePostById(id: number): Promise<void> {
    return await this.postRepository.deletePostById(id);
  }
}

export default PostService;
