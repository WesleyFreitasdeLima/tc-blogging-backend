import PostRepository from "../../../../repositories/post.repository.js";
import UserRepository from "../../../../repositories/user.repository.js";
import PostService from "../../../../services/post.service.js";
import UserService from "../../../../services/user.service.js";
import { PostController } from "../post.controller.js";

class PostControllerFactory {
  static create() {
    const postRepository = new PostRepository();
    const postService = new PostService(postRepository);

    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    return new PostController(postService, userService);
  }
}

export default PostControllerFactory;
