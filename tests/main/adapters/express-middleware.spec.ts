import { HttpResponse } from "@/application/helpers";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock, MockProxy } from "jest-mock-extended";
import { NextFunction, Request, RequestHandler, Response } from "express";

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>;
}

type Adapter = (middleware: Middleware) => RequestHandler;

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    await middleware.handle({ ...req.headers });
  };
};

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
});
