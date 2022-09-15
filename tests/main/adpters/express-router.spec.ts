import { getMockReq, getMockRes } from "@jest-mock/express";

import { ControllerStub } from "@/tests/application/mocks";
import { adaptExpressRoute } from "@/main/adapters";
import { RequestHandler } from "express";

type SutTypes = {
  sut: RequestHandler;
  controllerSpy: ControllerStub;
};

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerStub();
  const sut = adaptExpressRoute(controllerSpy);

  return {
    sut,
    controllerSpy,
  };
};

describe("ExpressRouter", () => {
  test("Should call handle with correct request", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res, next } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    const handleSpy = jest.spyOn(controllerSpy, "handle");
    await sut(req, res, next);

    expect(handleSpy).toHaveBeenLastCalledWith({ anyField: "any_value" });
    expect(handleSpy).toHaveBeenCalledTimes(1);
  });

  test("Should call handle with empty request", async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    const handleSpy = jest.spyOn(controllerSpy, "handle");
    await sut(req, res, next);

    expect(handleSpy).toHaveBeenLastCalledWith({});
    expect(handleSpy).toHaveBeenCalledTimes(1);
  });

  test("Should respond with 200 and valid data", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res, next } = getMockRes();

    const { sut } = makeSut();
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith("any_data");
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("Should respond with 400 and valid error", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res, next } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    controllerSpy.result = {
      statusCode: 400,
      data: new Error("any_error"),
    };
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("Should respond with 500 and valid error", async () => {
    const req = getMockReq({ body: { anyField: "any_value" } });
    const { res, next } = getMockRes();

    const { sut, controllerSpy } = makeSut();
    controllerSpy.result = {
      statusCode: 500,
      data: new Error("any_error"),
    };
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
