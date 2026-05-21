import { PostController } from "../post.controller.js";
import PostService from "../post.service.js";

class PostControllerFactory {
  static create() {
    const postService = new PostService();
    return new PostController(postService);
  }
}

export default PostControllerFactory;