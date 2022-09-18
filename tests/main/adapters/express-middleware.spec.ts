import { HttpResponse } from "@/application/helpers";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { mock } from "jest-mock-extended";
import { RequestHandler } from "express";

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
  test("Should call handle with correct request", async () => {
    const req = getMockReq({ headers: { anyField: "any_value" } });
    const { res, next } = getMockRes();
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ anyField: "any_value" });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  test("Should call handle with empty request", async () => {
    const req = getMockReq({ headers: {} });
    const { res, next } = getMockRes();
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);
    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });
});
