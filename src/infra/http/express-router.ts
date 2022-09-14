import { Request, Response } from "express";

import { Controller } from "@/application/controllers";
import { HttpStatusCode } from "@/application/helpers";

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}
  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.perform({ ...req.body });
    if (httpResponse.statusCode === HttpStatusCode.ok) {
      res.status(200).json(httpResponse.data);
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message });
    }
  }
}
