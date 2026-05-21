import { PostController } from "../controllers/post.controller.js";
import PostService from "../services/post.service.js";

class PostControllerFactory {
  static create() {
    const postService = new PostService();
    return new PostController(postService);
  }
}

export default PostControllerFactory;