import UserController from "../user.controller.js";
import UserRepository from "../user.repository.js";
import UserService from "../user.service.js";

class UserControllerFactory {
  static create() {
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);
    return new UserController(userService);
  }
}

export default UserControllerFactory;