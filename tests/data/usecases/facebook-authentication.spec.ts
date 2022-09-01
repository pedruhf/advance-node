import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import {
  SaveFacebookAccountRepoSpy,
  LoadFacebookUserApiSpy,
  LoadUserAccountByEmailRepoSpy,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepoSpy: LoadUserAccountByEmailRepoSpy;
  saveFacebookAccountRepoSpy: SaveFacebookAccountRepoSpy;
};

type SutParams = {
  loadFacebookUserApiSpy?: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepoSpy?: LoadUserAccountByEmailRepoSpy;
  saveFacebookAccountRepoSpy?: SaveFacebookAccountRepoSpy;
};

const makeSut = ({
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy(),
  loadUserAccountByEmailRepoSpy = new LoadUserAccountByEmailRepoSpy(),
  saveFacebookAccountRepoSpy = new SaveFacebookAccountRepoSpy(),
}: SutParams = {}): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepoSpy,
    saveFacebookAccountRepoSpy
  );

  return {
    sut,
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepoSpy,
    saveFacebookAccountRepoSpy,
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
    const { sut, loadUserAccountByEmailRepoSpy } = makeSut();
    await sut.perform({ token });
    expect(loadUserAccountByEmailRepoSpy.email).toBe(email);
    expect(loadUserAccountByEmailRepoSpy.callsCount).toBe(1);
  });

  test("Should call SaveFacebookAccountRepoSpy when LoadUserAccountByEmailRepo returns undefined", async () => {
    const loadUserAccountByEmailRepoSpy = new LoadUserAccountByEmailRepoSpy();
    loadUserAccountByEmailRepoSpy.result = undefined;
    const { sut, saveFacebookAccountRepoSpy } = makeSut({
      loadUserAccountByEmailRepoSpy,
    });
    await sut.perform({ token });
    expect(saveFacebookAccountRepoSpy.data).toEqual(facebookUserData);
    expect(saveFacebookAccountRepoSpy.callsCount).toBe(1);
  });

  test("Should call SaveFacebookAccountRepoSpy when LoadUserAccountByEmailRepo returns data", async () => {
    const { sut, saveFacebookAccountRepoSpy } = makeSut();
    await sut.perform({ token });
    expect(saveFacebookAccountRepoSpy.data).toEqual({
      id: "any_id",
      name: "any_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    expect(saveFacebookAccountRepoSpy.callsCount).toBe(1);
  });

  test("Should update account name when LoadUserAccountByEmailRepo not returns a name", async () => {
    const loadUserAccountByEmailRepoSpy = new LoadUserAccountByEmailRepoSpy();
    loadUserAccountByEmailRepoSpy.result = {
      id: "any_id",
    };
    const { sut, saveFacebookAccountRepoSpy } = makeSut({
      loadUserAccountByEmailRepoSpy,
    });
    await sut.perform({ token });
    expect(saveFacebookAccountRepoSpy.data).toEqual({
      id: "any_id",
      name: "any_facebook_name",
      email: "any_facebook_email",
      facebookId: "any_facebook_id",
    });
    expect(saveFacebookAccountRepoSpy.callsCount).toBe(1);
  });
});
