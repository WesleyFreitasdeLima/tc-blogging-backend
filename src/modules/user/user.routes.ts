import express from "express";
import UserControllerFactory from "./factories/user-controller.factory.js";

const routes = express.Router();

const userController = UserControllerFactory.create();

routes.post("/", userController.createUser.bind(userController));
routes.get("/", userController.getAllUsers.bind(userController));

export default routes;