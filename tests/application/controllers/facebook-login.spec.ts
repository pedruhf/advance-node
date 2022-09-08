import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";

type HttpResponse = { statusCode: number; data: any };

class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token });
    return {
      statusCode: 400,
      data: new Error("The field token is required"),
    };
  }
}

class FacebookAuthenticationSpy implements FacebookAuthentication {
  callsCount = 0;
  data?: FacebookAuthentication.Params;

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    this.callsCount++;
    this.data = params;
    return new AccessToken("any_token");
  }
}

type SutTypes = {
  sut: FacebookLoginController;
  facebookAuthenticationSpy: FacebookAuthenticationSpy;
};

const makeSut = (): SutTypes => {
  const facebookAuthenticationSpy = new FacebookAuthenticationSpy();
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
      data: new Error("The field token is required"),
    });
  });

  test("Should return 400 if token is null", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("The field token is required"),
    });
  });

  test("Should return 400 if token is undefined", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("The field token is required"),
    });
  });

  test("Should call FacebookAuthentication with correct params", async () => {
    const { sut, facebookAuthenticationSpy } = makeSut();
    await sut.handle({ token: "any_token" });

    expect(facebookAuthenticationSpy.data).toEqual({ token: "any_token" });
    expect(facebookAuthenticationSpy.callsCount).toBe(1);
  });
});
