import express from "express";
import PostControllerFactory from "../factories/PostControllerFactory.js";

const routes = express.Router();

const postController = PostControllerFactory.create();

routes.get("/", postController.getAllPosts.bind(postController));
routes.post("/", postController.createPost.bind(postController));

export default routes;