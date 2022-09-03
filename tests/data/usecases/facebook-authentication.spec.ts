import { AccessToken, FacebookAccount } from "@/domain/models";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import { TokenGenerator } from "@/data/contracts/crypto";
import { LoadFacebookUserApiSpy, UserAccountSpy } from "@/tests/data/mocks";
import { fbModelMock } from "@/tests/domain/mocks";

jest.mock("@/domain/models/facebook-account");

class TokenGeneratorSpy implements TokenGenerator {
  callsCount = 0;
  data?: TokenGenerator.Params;
  result = "any_generated_token";

  async generate(
    params: TokenGenerator.Params
  ): Promise<TokenGenerator.Result> {
    this.callsCount++;
    this.data = params;
    return this.result;
  }
}

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
  userAccountSpy: UserAccountSpy;
  tokenGeneratorSpy: TokenGeneratorSpy;
};

type SutParams = {
  loadFacebookUserApiSpy?: LoadFacebookUserApiSpy;
  userAccountSpy?: UserAccountSpy;
  tokenGeneratorSpy?: TokenGeneratorSpy;
};

const makeSut = ({
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy(),
  userAccountSpy = new UserAccountSpy(),
  tokenGeneratorSpy = new TokenGeneratorSpy(),
}: SutParams = {}): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(
    loadFacebookUserApiSpy,
    userAccountSpy,
    tokenGeneratorSpy
  );

  return {
    sut,
    loadFacebookUserApiSpy,
    userAccountSpy,
    tokenGeneratorSpy,
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

  test("Should call SaveFacebookAccountRepo with facebookAccount when LoadFacebookUserApi returns undefined", async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({
      anyField: "any_value",
    }));
    jest.mocked(FacebookAccount).mockImplementation(facebookAccountStub);
    const { sut, userAccountSpy } = makeSut();
    await sut.perform({ token });
    expect(userAccountSpy.saveWithFacebookData).toEqual({
      anyField: "any_value",
    });
    expect(userAccountSpy.saveWithFacebookCallsCount).toBe(1);
  });

  test("Should call TokenGenerator with correct params", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    await sut.perform({ token });
    expect(tokenGeneratorSpy.data).toEqual({
      key: "any_account_id",
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(tokenGeneratorSpy.callsCount).toBe(1);
  });

  test("Should return an AccessToken on success", async () => {
    const { sut } = makeSut();
    const authResult = await sut.perform({ token });
    expect(authResult).toEqual(new AccessToken("any_generated_token"));
  });
});
