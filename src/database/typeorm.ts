import { DataSource } from "typeorm";
import { env } from "../env/index.js";

// Entities
import { Coment } from "../modules/coment/coment.entity.js";
import { Post } from "../modules/post/post.entity.js";
import { User } from "../modules/user/user.entity.js";

// Migrations
import { CreateTables1779748545908 } from "./migrations/1779748545908-CreateTables.js";

const isProduction = env.NODE_ENV === "production";

export const appDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  entities: [User, Post, Coment],
  migrations: [CreateTables1779748545908],

  logging: env.NODE_ENV === "development",
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});