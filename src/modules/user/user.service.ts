import type UserRepository from "./user.repository.js";

class UserService {
  constructor(private userRepository: UserRepository) {}
}

export default UserService;