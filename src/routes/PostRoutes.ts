import express from "express";
import { PostController } from "../controllers/PostController.js";

const routes = express.Router();

routes.get("/", PostController.getAllPosts);

export default routes;