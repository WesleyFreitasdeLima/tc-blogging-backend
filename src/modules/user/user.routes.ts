import express from "express";
import UserControllerFactory from "./factories/user-controller.factory.js";
import { verifyAuth } from "../../middlewares/verify-auth.middleware.js";

const routes = express.Router();

const userController = UserControllerFactory.create();

routes.post("/", userController.createUser.bind(userController));

routes.use(verifyAuth);

routes.get("/", userController.getAllUsers.bind(userController));
routes.get("/:id", userController.getUserById.bind(userController));
routes.put("/:id", userController.editUserById.bind(userController));
routes.delete("/:id", userController.deleteUserById.bind(userController));

export default routes;