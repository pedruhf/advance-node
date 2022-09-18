import { ForbiddenError } from "@/application/errors";
import { HttpStatusCode } from "@/application/helpers";
import { AuthenticationMiddleware } from "@/application/middlewares";

type SutTypes = {
  sut: AuthenticationMiddleware;
  authorizeSpy: jest.Mock;
};

const makeSut = (): SutTypes => {
  const authorizeSpy = jest.fn();
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

    expect(authorizeSpy).toHaveBeenCalledWith({ token: authorization });
    expect(authorizeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should return 403 if authorize throws", async () => {
    const { sut, authorizeSpy } = makeSut();
    authorizeSpy.mockRejectedValueOnce(new Error("any_error"));
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.forbidden,
      data: new ForbiddenError(),
    });
  });

  test("Should return 200 if userId on success", async () => {
    const { sut, authorizeSpy } = makeSut();
    authorizeSpy.mockResolvedValueOnce("any_user_id");
    const httpResponse = await sut.handle({ authorization });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.ok,
      data: { userId: "any_user_id" },
    });
  });
});
