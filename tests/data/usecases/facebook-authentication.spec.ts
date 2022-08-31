import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import { LoadFacebookUserApiSpy } from "@/tests/data/mocks";

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
