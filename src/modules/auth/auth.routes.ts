import express from "express";
import AuthControllerFactory from "./factories/auth-controller.factory.js";

const routes = express.Router();

const authController = AuthControllerFactory.create();

routes.post("/login", authController.login.bind(authController));

export default routes;