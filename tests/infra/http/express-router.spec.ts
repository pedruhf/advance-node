import { Request, Response } from "express";
import { getMockReq, getMockRes} from "@jest-mock/express";

import { Controller } from "@/application/controllers";
import { ControllerStub } from "@/tests/application/mocks";

class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.perform({ ...req.body });
  }
}

describe("ExpressRouter", () => {
  test("Should call handle with correct request", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res } = getMockRes();

    const controllerStub = new ControllerStub();
    const performSpy = jest.spyOn(controllerStub, "perform");
    const sut = new ExpressRouter(controllerStub);
    await sut.adapt(req, res);

    expect(performSpy).toHaveBeenLastCalledWith({ anyField: "any_value" });
  });
});
