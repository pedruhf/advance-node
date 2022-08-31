import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
    return new AuthenticationError();
  }
}

interface LoadFacebookUserApi {
  loadUser: (
    params: LoadFacebookUserApi.Params
  ) => Promise<LoadFacebookUserApi.Result>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };

  export type Result = undefined;
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  result? = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    return this.result;
  }
}

describe("FacebookAuthentication Usecase", () => {
  test("Should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApiSpy.token).toBe("any_token");
  });

  test("Should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    loadFacebookUserApiSpy.result = undefined;
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
