import type UserService from "./user.service.js";

class UserController {
  constructor(private userService: UserService) {}
}

export default UserController;