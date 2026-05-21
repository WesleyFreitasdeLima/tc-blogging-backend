import { PostController } from "../post.controller.js";
import PostService from "../post.service.js";
import PostRepository from "../post.repository.js";

class PostControllerFactory {
  static create() {
    const postRepository = new PostRepository();
    const postService = new PostService(postRepository);
    return new PostController(postService);
  }
}

export default PostControllerFactory;