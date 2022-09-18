import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock, MockProxy } from "jest-mock-extended";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { HttpStatusCode } from "@/application/helpers";
import { Middleware } from "@/application/middlewares";
import { adaptExpressMiddleware } from "@/main/adapters";

describe("Express Middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let middleware: MockProxy<Middleware>;
  let sut: RequestHandler;

  beforeAll(() => {
    req = getMockReq({ headers: { anyField: "any_value" } });
    res = getMockRes().res;
    next = getMockRes().next;
    middleware = mock<Middleware>();
    middleware.handle.mockResolvedValue({
      statusCode: HttpStatusCode.ok,
      data: {
        validProp: "any_data",
        emptyProp: "",
        nullProp: null,
        undefinedProp: undefined,
      },
    });
  });

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware);
  });

  test("Should call handle with correct request", async () => {
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ anyField: "any_value" });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  test("Should call handle with empty request", async () => {
    req = getMockReq({ headers: {} });
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  test("Should respond with correct statusCode and error", async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: HttpStatusCode.serverError,
      data: new Error("any_error"),
    });
    await sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: "any_error" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  test("Should add valid data to req.locals", async () => {
    await sut(req, res, next);

    expect(req.locals).toEqual({ validProp: "any_data" });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
