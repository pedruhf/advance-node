import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import { LoadFacebookUserApiSpy, UserAccountSpy } from "@/tests/data/mocks";

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
  const email = "any_facebook_email";
  const facebookUserData = {
    email: "any_facebook_email",
    name: "any_facebook_name",
    facebookId: "any_facebook_id",
  };

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
    expect(userAccountSpy.loadUserEmail).toBe(email);
    expect(userAccountSpy.loadUserCallsCount).toBe(1);
  });

  test("Should call SaveFacebookAccountRepoSpy when LoadUserAccountByEmailRepo returns undefined", async () => {
    const userAccountSpy = new UserAccountSpy();
    userAccountSpy.loadUserResult = undefined;
    const { sut } = makeSut({
      userAccountSpy,
    });
    await sut.perform({ token });
    expect(userAccountSpy.saveWithFacebookData).toEqual(facebookUserData);
    expect(userAccountSpy.saveWithFacebookCallsCount).toBe(1);
  });

  test("Should call SaveFacebookAccountRepoSpy when LoadUserAccountByEmailRepo returns data", async () => {
    const { sut, userAccountSpy } = makeSut();
    await sut.perform({ token });
    expect(userAccountSpy.saveWithFacebookData).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    expect(userAccountSpy.saveWithFacebookCallsCount).toBe(1);
  });

  test("Should update account name when LoadUserAccountByEmailRepo not returns a name", async () => {
    const userAccountSpy = new UserAccountSpy();
    userAccountSpy.loadUserResult = {
      id: "any_id",
    };
    const { sut } = makeSut({
      userAccountSpy,
    });
    await sut.perform({ token });
    expect(userAccountSpy.saveWithFacebookData).toEqual({
      id: "any_id",
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    expect(userAccountSpy.saveWithFacebookCallsCount).toBe(1);
  });
});
