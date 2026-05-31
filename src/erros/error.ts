export class AppError extends Error {
  public readonly statusCode: number;
  constructor(message: string = "Internal error server", statusCode = 500) {
    super(message);

    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
