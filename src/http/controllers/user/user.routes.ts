import UserControllerFactory from "./factories/user-controller.factory.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const userController = UserControllerFactory.create();

routes.get("/", userController.getAllUser.bind(userController));
routes.post("/", userController.createUser.bind(userController));

export default routes;
