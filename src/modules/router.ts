import {
  Router,
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";

function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function createRouter() {
  const router = Router();

  const methods = ["get", "post", "put", "patch", "delete"] as const;

  methods.forEach((method) => {
    const original = router[method].bind(router);

    router[method] = ((path: string, ...handlers: RequestHandler[]) => {
      const wrapped = handlers.map(asyncHandler);

      return original(path, ...wrapped);
    }) as (typeof router)[typeof method];
  });

  return router;
}
