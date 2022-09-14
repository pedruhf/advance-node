import { RequestHandler } from "express";

import { Controller } from "@/application/controllers";
import { HttpStatusCode } from "@/application/helpers";

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body });
    if (httpResponse.statusCode === HttpStatusCode.ok) {
      res.status(200).json(httpResponse.data);
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message });
    }
  };
};
