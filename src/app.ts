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

const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(error.message);
});

export default app;
