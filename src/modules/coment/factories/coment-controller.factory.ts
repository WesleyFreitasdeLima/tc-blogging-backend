import UserRepository from "../../user/user.repository.js";
import UserService from "../../user/user.service.js";
import ComentRepository from "../coment.repository.js";
import ComentService from "../coment.service.js";
import { ComentController } from "../coment.controller.js";
import PostService from "../../post/post.service.js";
import PostRepository from "../../post/post.repository.js";

class ComentControllerFactory {
  static create() {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const postRepository = new PostRepository();
    const postService = new PostService(postRepository);

    const comentRepository = new ComentRepository();
    const comentService = new ComentService(comentRepository);

    return new ComentController(comentService, postService, userService);
  }
}

export default ComentControllerFactory;
