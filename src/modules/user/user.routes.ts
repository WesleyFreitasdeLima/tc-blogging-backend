import express from "express";
import UserControllerFactory from "./factories/user-controller.factory.js";
import {
  verifyAuth,
  verifyRole,
} from "../../middlewares/verify-auth.middleware.js";
import { UserRoleEnum } from "../../enum/user-role.enum.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const userController = UserControllerFactory.create();

routes.use(verifyAuth);

routes.get(
  "/",
  verifyRole(UserRoleEnum.ADMIN),
  userController.getAllUsers.bind(userController),
);
routes.get("/:id", userController.getUserById.bind(userController));
routes.post(
  "/",
  verifyRole(UserRoleEnum.ADMIN),
  userController.createUser.bind(userController),
);
routes.put("/:id", userController.editUserById.bind(userController));
routes.delete(
  "/:id",
  verifyRole(UserRoleEnum.ADMIN),
  userController.deleteUserById.bind(userController),
);

export default routes;
