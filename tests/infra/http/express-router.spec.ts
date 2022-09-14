import { getMockReq, getMockRes } from "@jest-mock/express";

import { ControllerStub } from "@/tests/application/mocks";
import { ExpressRouter } from "@/infra/http";

type SutTypes = {
  sut: ExpressRouter;
  controllerSpy: ControllerStub;
};

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

  test("Should respond with 400 and valid error", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    controllerSpy.result = {
      statusCode: 400,
      data: new Error("any_error"),
    };
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("Should respond with 500 and valid error", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    controllerSpy.result = {
      statusCode: 500,
      data: new Error("any_error"),
    };
    await sut.adapt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
