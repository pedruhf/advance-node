import { FacebookAuthentication } from "@/domain/features";

class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi
  ) {}
  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserByTokenApi.loadUser(params);
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe("FacebookAuthentication Usecase", () => {
  test("Should call LoadFacebookUserApi with correct params", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy);
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApiSpy.token).toBe("any_token");
  });
});
