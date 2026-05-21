import { PostController } from "../controllers/PostController.js";
import PostService from "../services/PostService.js";

class PostControllerFactory {
  static create() {
    const postService = new PostService();
    return new PostController(postService);
  }
}

export default PostControllerFactory;