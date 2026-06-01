import { AppError } from "./error.js";

export class AppRegraNegocio extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
