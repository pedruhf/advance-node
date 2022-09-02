import { mocked } from "ts-jest/utils";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import { LoadFacebookUserApiSpy, UserAccountSpy } from "@/tests/data/mocks";
import { fbModelMock } from "@/tests/domain/mocks";
import { FacebookAccount } from "@/domain/models";

jest.mock("@/domain/models/facebook-account");

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
  userAccountSpy: UserAccountSpy;
};

type SutParams = {
  loadFacebookUserApiSpy?: LoadFacebookUserApiSpy;
  userAccountSpy?: UserAccountSpy;
};

const makeSut = ({
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy(),
  userAccountSpy = new UserAccountSpy(),
}: SutParams = {}): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(
    loadFacebookUserApiSpy,
    userAccountSpy
  );

  return {
    sut,
    loadFacebookUserApiSpy,
    userAccountSpy,
  };
};

describe("FacebookAuthentication Usecase", () => {
  const token = "any_token";
  const facebookUserData = fbModelMock();

  test("Should call LoadFacebookUserApi with correct params", async () => {
    const { sut, loadFacebookUserApiSpy } = makeSut();
    await sut.perform({ token });
    expect(loadFacebookUserApiSpy.token).toBe(token);
    expect(loadFacebookUserApiSpy.callsCount).toBe(1);
  });

  test("Should return AuthenticationError if LoadFacebookUserApi returns undefined", async () => {
    const loadFacebookUserApiSpy = new LoadFacebookUserApiSpy();
    loadFacebookUserApiSpy.result = undefined;
    const { sut } = makeSut({ loadFacebookUserApiSpy });
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AuthenticationError());
  });

  test("Should call LoadUserAccountByEmailRepo when LoadFacebookUserApi returns data", async () => {
    const { sut, userAccountSpy } = makeSut();
    await sut.perform({ token });
    expect(userAccountSpy.loadUserEmail).toBe(facebookUserData.email);
    expect(userAccountSpy.loadUserCallsCount).toBe(1);
  });

  test("Should call SaveFacebookAccountRepoSpy with facebookAccount when LoadFacebookUserApi returns undefined", async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({
      anyField: "any_value",
    }));
    mocked(FacebookAccount).mockImplementation(facebookAccountStub);
    const { sut, userAccountSpy } = makeSut();
    await sut.perform({ token });
    expect(userAccountSpy.saveWithFacebookData).toEqual({
      anyField: "any_value",
    });
    expect(userAccountSpy.saveWithFacebookCallsCount).toBe(1);
  });
});
