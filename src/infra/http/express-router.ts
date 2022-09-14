import { RequestHandler } from "express";

import { Controller } from "@/application/controllers";
import { HttpStatusCode } from "@/application/helpers";

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({ ...req.body });
    const json = statusCode === HttpStatusCode.ok ? data : { error: data.message };
    res.status(statusCode).json(json);
  };
};
