import { ForbiddenError } from "@/application/errors";
import { HttpResponse, HttpStatusCode } from "@/application/helpers";

type HttpRequest = {
  authorization: string;
};

class AuthenticationMiddleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return {
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    };
  }
}

describe("Authentication Middleware", () => {
  test("Should return 403 if authorization is empty", async () => {
    const sut = new AuthenticationMiddleware();

    const httpResponse = await sut.handle({ authorization: "" });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });
});
