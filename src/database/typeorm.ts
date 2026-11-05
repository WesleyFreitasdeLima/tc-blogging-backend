import { DataSource } from "typeorm";
import { env } from "../env/index.js";

export const appDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: ["dist/modules/**/*.entity.js"],
  migrations: ["dist/database/migrations/*.js"],
  logging: env.NODE_ENV === "development",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});