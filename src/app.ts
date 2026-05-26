import "reflect-metadata";
import "./database/typeorm.js";

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import postRoutes from "./http/controllers/post/post.routes.js";
import userRoutes from "./http/controllers/user/user.routes.js";
import { errorMiddleware } from "./http/middlewares/error.middleware.js";

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use(errorMiddleware);

export default app;
