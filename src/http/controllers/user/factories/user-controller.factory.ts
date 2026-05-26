import UserRepository from "../../../../repositories/user.repository.js";
import UserService from "../../../../services/user.service.js";
import { UserController } from "../user.controller.js";

class UserControllerFactory {
  static create() {
    const postRepository = new UserRepository();
    const userServiceUserRepository = new UserService(postRepository);
    return new UserController(userServiceUserRepository);
  }
}

export default UserControllerFactory;
