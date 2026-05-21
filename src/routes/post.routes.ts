import express from "express";
import PostControllerFactory from "../factories/post-controller.factory.js";

const routes = express.Router();

const postController = PostControllerFactory.create();

routes.get("/", postController.getAllPosts.bind(postController));
routes.post("/", postController.createPost.bind(postController));

export default routes;