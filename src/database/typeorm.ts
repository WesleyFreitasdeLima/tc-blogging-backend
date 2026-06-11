import { DataSource } from "typeorm";
import { env } from "../env/index.js";
import { User } from "../modules/user/user.entity.js";
import { CreateTables1779748545908 } from "./migrations/1779748545908-CreateTables.js";
import { Post } from "../modules/post/post.entity.js";

export const appDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [Post, User],
  migrations: [CreateTables1779748545908],
  logging: env.NODE_ENV === "development",
});

export async function connectDatabase() {
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
    console.log("Database with typeorm connected");
  }

  throw new Error("❌ Error connection")
}
