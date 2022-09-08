import { AuthenticationError } from "@/domain/errors";
import { AccessToken } from "@/domain/models";
import { FacebookLoginController } from "@/application/controllers";
import { RequiredFieldError, ServerError } from "@/application/errors";
import { FacebookAuthenticationSpy } from "@/tests/infra/mocks";

type SutTypes = {
  sut: FacebookLoginController;
  facebookAuthenticationSpy: FacebookAuthenticationSpy;
};

const makeSut = (
  facebookAuthenticationSpy = new FacebookAuthenticationSpy()
): SutTypes => {
  const sut = new FacebookLoginController(facebookAuthenticationSpy);

  return {
    sut,
    facebookAuthenticationSpy,
  };
};

describe("FacebookLoginController", () => {
  test("Should return 400 if token is empty", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: "" });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token"),
    });
  });

  test("Should return 400 if token is null", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token"),
    });
  });

  test("Should return 400 if token is undefined", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError("token"),
    });
  });

  test("Should call FacebookAuthentication with correct params", async () => {
    const { sut, facebookAuthenticationSpy } = makeSut();
    await sut.handle({ token: "any_token" });

    expect(facebookAuthenticationSpy.data).toEqual({ token: "any_token" });
    expect(facebookAuthenticationSpy.callsCount).toBe(1);
  });

  test("Should return 401 if authentication fails", async () => {
    const facebookAuthenticationSpy = new FacebookAuthenticationSpy();
    facebookAuthenticationSpy.result = new AuthenticationError();
    const { sut } = makeSut(facebookAuthenticationSpy);
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError(),
    });
  });

  test("Should return 200 if authentication succeeds", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: new AccessToken("any_token").value,
      },
    });
  });

  test("Should return 500 if authentication throws", async () => {
    const error = new ServerError();
    const facebookAuthenticationSpy = new FacebookAuthenticationSpy();
    jest
      .spyOn(facebookAuthenticationSpy, "perform")
      .mockRejectedValueOnce(error);

    const { sut } = makeSut(facebookAuthenticationSpy);
    const httpResponse = await sut.handle({ token: "any_token" });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: error,
    });
  });
});
