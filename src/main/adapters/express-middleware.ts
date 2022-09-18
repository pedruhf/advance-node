import { HttpStatusCode } from "@/application/helpers";
import { Middleware } from "@/application/middlewares/middleware";
import { RequestHandler } from "express";

type Adapter = (middleware: Middleware) => RequestHandler;

export const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers });
    if (statusCode === HttpStatusCode.ok) {
      const entries = Object.entries(data).filter((entry) => entry[1]);
      req.locals = { ...req.locals, ...Object.fromEntries(entries) };
      next();
    }
    res.status(statusCode).json(data);
  };
};
