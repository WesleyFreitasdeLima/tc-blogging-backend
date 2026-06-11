import "reflect-metadata";

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import postRoutes from "./modules/post/post.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found-router.middleware.js";

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/health", (_, res: Response) => res.status(200).send("OK"));

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
