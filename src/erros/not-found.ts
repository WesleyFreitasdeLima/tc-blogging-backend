import { AppError } from "./error.js";

export class AppNotFound extends AppError {
  constructor(field: string) {
    super(`${field} not found.`, 404);
  }
}
