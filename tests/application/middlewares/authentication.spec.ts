import { ForbiddenError } from "@/application/errors";
import { forbidden, HttpResponse, HttpStatusCode } from "@/application/helpers";

type HttpRequest = {
  authorization: string;
};

class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden();
  }
}

const makeSut = (): AuthenticationMiddleware => {
  const sut = new AuthenticationMiddleware();
  return sut;
};

describe("Authentication Middleware", () => {
  test("Should return 403 if authorization is empty", async () => {
    const sut = makeSut();

    const httpResponse = await sut.handle({ authorization: "" });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 403 if authorization is null", async () => {
    const sut = makeSut();

    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 403 if authorization is undefined", async () => {
    const sut = makeSut();

    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });
});
