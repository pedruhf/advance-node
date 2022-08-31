import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationUsecase } from "@/data/usecases";

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result? = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
};

const makeSut = (
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy()
): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(loadFacebookUserApiSpy);

  return {
    sut,
    loadFacebookUserApiSpy,
  };
};

describe("FacebookAuthentication Usecase", () => {
  test("Should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut();
    await sut.perform({ token: "any_token" });
    expect(loadFacebookUserApiSpy.token).toBe("any_token");
    expect(loadFacebookUserApiSpy.callsCount).toBe(1);
  });

  test("Should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    loadFacebookUserApiSpy.result = undefined;
    const { sut } = makeSut(loadFacebookUserApiSpy);
    const authResult = await sut.perform({ token: "any_token" });
    expect(authResult).toEqual(new AuthenticationError());
  });
});
