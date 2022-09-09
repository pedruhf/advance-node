import { AccessToken } from "@/domain/models";
import { FacebookLoginController } from "@/application/controllers";
import {
  RequiredFieldError,
  ServerError,
  UnauthorizedError,
} from "@/application/errors";
import { FacebookAuthenticationSpy } from "@/tests/infra/mocks";
import {
  RequiredStringValidator,
  ValidationComposite,
} from "@/application/validation";

jest.mock("@/application/validation/composite");

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
  const token = "any_token";

  it("Should return 400 if validation fails", async () => {
    const error = new RequiredFieldError("token");
    const validationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(validationCompositeSpy);

    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token });

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator("any_token", "token"),
    ]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  test("Should call FacebookAuthentication with correct params", async () => {
    const { sut, facebookAuthenticationSpy } = makeSut();
    await sut.handle({ token });

    expect(facebookAuthenticationSpy.data).toEqual({ token });
    expect(facebookAuthenticationSpy.callsCount).toBe(1);
  });

  test("Should return 401 if authentication fails", async () => {
    const facebookAuthenticationSpy = new FacebookAuthenticationSpy();
    facebookAuthenticationSpy.result = new UnauthorizedError();
    const { sut } = makeSut(facebookAuthenticationSpy);
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  test("Should return 200 if authentication succeeds", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token });

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
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: error,
    });
  });
});
