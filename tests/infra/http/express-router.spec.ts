import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { Controller } from "@/application/controllers";
import { ControllerStub } from "@/tests/application/mocks";

class ExpressRouter {
  constructor(private readonly controller: Controller) {}
  async adapt(req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.perform({ ...req.body });
    res.status(200).json(httpResponse.data);
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
    expect(performSpy).toHaveBeenCalledTimes(1);
  });

  test("Should call handle with empty request", async () => {
    const req = getMockReq();
    const { res } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    const performSpy = jest.spyOn(controllerSpy, "perform");
    await sut.adapt(req, res);

    expect(performSpy).toHaveBeenLastCalledWith({});
    expect(performSpy).toHaveBeenCalledTimes(1);
  });

  test("Should respond with 200 and valid data", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res } = getMockRes();

    const { sut } = makeSut();
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("any_data");
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
