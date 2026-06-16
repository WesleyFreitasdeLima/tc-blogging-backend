import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  API_PORT: z.coerce.number().default(3000),

  DB_HOST: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_PORT: z.coerce.number(),

  JWT_SECRET: z.string(),

  ADMIN_USER_NAME: z.string().default("Administrador"),
  ADMIN_USER_USERNAME: z.string().default("admin"),
  ADMIN_USER_EMAIL: z.string().email().default("teste@teste.com"),
  ADMIN_USER_PASSWORD: z.string().default("123456"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid enviroment variables", _env.error.format());
  throw new Error("Invalid enviroment variables");
}

export const env = _env.data;
