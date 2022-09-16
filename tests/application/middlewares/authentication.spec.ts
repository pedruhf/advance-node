import { ForbiddenError } from "@/application/errors";
import { forbidden, HttpResponse, HttpStatusCode } from "@/application/helpers";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/data/contracts/middlewares";
import { AuthorizeSpy } from "@/tests/data/mocks/authorize";

type HttpRequest = {
  authorization: string;
};

class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    const error = new RequiredStringValidator(authorization, "authorization").validate();
    if (error) {
      return forbidden();
    }

    await this.authorize.perform({ token: authorization });
  }
}

type SutTypes = {
  sut: AuthenticationMiddleware;
  authorizeSpy: AuthorizeSpy;
};

const makeSut = (): SutTypes => {
  const authorizeSpy = new AuthorizeSpy();
  const sut = new AuthenticationMiddleware(authorizeSpy);
  return {
    sut,
    authorizeSpy,
  };
};

describe("Authentication Middleware", () => {
  const authorization = "any_authorization_token";

  test("Should return 403 if authorization is empty", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ authorization: "" });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 403 if authorization is null", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 403 if authorization is undefined", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should call Authorize with correct input", async () => {
    const { sut, authorizeSpy } = makeSut();
    await sut.handle({ authorization });

    expect(authorizeSpy.input).toEqual({ token: authorization });
    expect(authorizeSpy.callsCount).toBe(1);
  });
});
