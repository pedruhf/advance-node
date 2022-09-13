import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { Controller } from "@/application/controllers";
import { ControllerStub } from "@/tests/application/mocks";

class ExpressRouter {
  constructor(private readonly controller: Controller) {}
  async adapt(req: Request, res: Response): Promise<void> {
    await this.controller.perform({ ...req.body });
  }
}

type SutTypes = {
  sut: ExpressRouter;
  controllerSpy: ControllerStub
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerStub();
  const sut = new ExpressRouter(controllerSpy);

  return {
    sut,
    controllerSpy,
  };
};

describe("ExpressRouter", () => {
  test("Should call handle with correct request", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    const performSpy = jest.spyOn(controllerSpy, "perform");
    await sut.adapt(req, res);

    expect(performSpy).toHaveBeenLastCalledWith({ anyField: "any_value" });
  });

  test("Should call handle with empty request", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    const performSpy = jest.spyOn(controllerSpy, "perform");
    await sut.adapt(req, res);

    expect(performSpy).toHaveBeenLastCalledWith({});
  });
});
