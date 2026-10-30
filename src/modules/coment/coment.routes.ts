import express from "express";
import ComentControllerFactory from "./factories/coment-controller.factory.js";
import {
  verifyAuth,
  verifyRole,
} from "../../middlewares/verify-auth.middleware.js";
import { UserRoleEnum } from "../../enum/user-role.enum.js";
import { createRouter } from "../router.js";

const routes = createRouter();

const comentController = ComentControllerFactory.create();

routes.get("/post/:id", comentController.getAllComent.bind(comentController));
routes.get("/:id", comentController.getComentById.bind(comentController));

routes.use(verifyAuth);

routes.post(
  "/",
  verifyRole(UserRoleEnum.STUDENT),
  comentController.createComent.bind(comentController),
);
routes.put(
  "/:id",
  verifyRole(UserRoleEnum.STUDENT),
  comentController.editComentById.bind(comentController),
);
routes.delete(
  "/:id",
  verifyRole(UserRoleEnum.STUDENT),
  comentController.deleteComentById.bind(comentController),
);

export default routes;
