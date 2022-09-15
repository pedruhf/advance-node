import { AccessToken } from "@/domain/entities";
import { FacebookLoginController } from "@/application/controllers";
import {
  UnauthorizedError,
} from "@/application/errors";
import { FacebookAuthenticationSpy } from "@/tests/infra/mocks";
import {
  RequiredStringValidator,
} from "@/application/validation";

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

  it("Should build Validators correctly", async () => {
    const { sut } = makeSut();
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([
      new RequiredStringValidator("any_token", "token"),
    ]);
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
});
