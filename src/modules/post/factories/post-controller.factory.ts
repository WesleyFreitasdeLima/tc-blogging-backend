import { PostController } from "../post.controller.js";
import PostService from "../post.service.js";
import PostRepository from "../post.repository.js";
import UserRepository from "../../user/user.repository.js";
import UserService from "../../user/user.service.js";

class PostControllerFactory {
  static create() {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const postRepository = new PostRepository();
    const postService = new PostService(postRepository);
    return new PostController(postService, userService);
  }
}

export default PostControllerFactory;
