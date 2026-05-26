import express from "express";
import PostControllerFactory from "./factories/post-controller.factory.js";
import { verifyAuth } from "../../middlewares/verify-auth.middleware.js";

const routes = express.Router();

routes.use(verifyAuth);

const postController = PostControllerFactory.create();

routes.get("/", postController.getAllPosts.bind(postController));
routes.post("/", postController.createPost.bind(postController));
routes.get("/search", postController.searchPostsByKeywords.bind(postController));
routes.get("/:id", postController.getPostById.bind(postController));
routes.put("/:id", postController.editPostById.bind(postController));
routes.delete("/:id", postController.deletePostById.bind(postController));

export default routes;