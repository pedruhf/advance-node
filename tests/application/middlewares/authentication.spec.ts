import { ForbiddenError } from "@/application/errors";
import { forbidden, HttpResponse, HttpStatusCode, success } from "@/application/helpers";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/data/contracts/middlewares";
import { AuthorizeSpy } from "@/tests/data/mocks/authorize";

type HttpRequest = {
  authorization: string;
};

type Model = { userId: string } | Error;

class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    const error = new RequiredStringValidator(authorization, "authorization").validate();
    if (error) {
      return forbidden();
    }

    try {
      const userId = await this.authorize.perform({ token: authorization });
      return success({ userId });
    } catch {
      return forbidden();
    }
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

  test("Should return 403 if authorize throws", async () => {
    const { sut, authorizeSpy } = makeSut();
    jest.spyOn(authorizeSpy, "perform").mockRejectedValueOnce(new Error("any_error"));
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 200 if userId on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.ok,
      data: { userId: "any_user_id" },
    });
  });
});
