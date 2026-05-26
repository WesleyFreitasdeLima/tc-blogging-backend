import PostControllerFactory from "./factories/post-controller.factory.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const postController = PostControllerFactory.create();

routes.get("/", postController.getAllPosts.bind(postController));
routes.post("/", postController.createPost.bind(postController));

export default routes;
