import express from "express";
import AuthControllerFactory from "./factories/auth-controller.factory.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const authController = AuthControllerFactory.create();

routes.post("/login", authController.login.bind(authController));

export default routes;
