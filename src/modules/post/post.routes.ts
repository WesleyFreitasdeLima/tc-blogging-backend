import express from "express";
import PostControllerFactory from "./factories/post-controller.factory.js";
import {
  verifyAuth,
  verifyRole,
} from "../../middlewares/verify-auth.middleware.js";
import { UserRoleEnum } from "../../enum/user-role.enum.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const postController = PostControllerFactory.create();

routes.get("/", postController.getAllPosts.bind(postController));

routes.get(
  "/search",
  postController.searchPostsByKeywords.bind(postController),
);
routes.use(verifyAuth);

routes.post(
  "/",
  verifyRole(UserRoleEnum.TEACHER),
  postController.createPost.bind(postController),
);
routes.get("/:id", postController.getPostById.bind(postController));
routes.put(
  "/:id",
  verifyRole(UserRoleEnum.TEACHER),
  postController.editPostById.bind(postController),
);
routes.delete(
  "/:id",
  verifyRole(UserRoleEnum.TEACHER),
  postController.deletePostById.bind(postController),
);

export default routes;
