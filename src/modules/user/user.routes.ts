import express from "express";
import UserControllerFactory from "./factories/user-controller.factory.js";

const routes = express.Router();

const userController = UserControllerFactory.create();

export default routes;