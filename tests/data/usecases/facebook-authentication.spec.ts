import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import {
  CreateUserAccountByFacebookRepositorySpy,
  LoadFacebookUserApiSpy,
  LoadUserAccountByEmailRepositorySpy,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepositorySpy: LoadUserAccountByEmailRepositorySpy;
  createUserAccountByFacebookRepositorySpy: CreateUserAccountByFacebookRepositorySpy;
};

type SutParams = {
  loadFacebookUserApiSpy?: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepositorySpy?: LoadUserAccountByEmailRepositorySpy;
  createUserAccountByFacebookRepositorySpy?: CreateUserAccountByFacebookRepositorySpy;
};

const makeSut = ({
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy(),
  loadUserAccountByEmailRepositorySpy = new LoadUserAccountByEmailRepositorySpy(),
  createUserAccountByFacebookRepositorySpy = new CreateUserAccountByFacebookRepositorySpy(),
}: SutParams = {}): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepositorySpy,
    createUserAccountByFacebookRepositorySpy
  );

  return {
    sut,
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepositorySpy,
    createUserAccountByFacebookRepositorySpy,
  };
};

describe("FacebookAuthentication Usecase", () => {
  const token = "any_token";
  const email = "any_facebook_email";
  const createUserData = {
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

  test("Should call LoadUserAccountByEmailRepository when LoadFacebookUserApi returns data", async () => {
    const { sut, loadUserAccountByEmailRepositorySpy } = makeSut();
    await sut.perform({ token });
    expect(loadUserAccountByEmailRepositorySpy.email).toBe(email);
    expect(loadUserAccountByEmailRepositorySpy.callsCount).toBe(1);
  });

  test("Should call CreateUserAccountRepository when LoadUserAccountByEmailRepository returns undefined", async () => {
    const loadUserAccountByEmailRepositorySpy =
      new LoadUserAccountByEmailRepositorySpy();
    loadUserAccountByEmailRepositorySpy.result = undefined;
    const { sut, createUserAccountByFacebookRepositorySpy } = makeSut({
      loadUserAccountByEmailRepositorySpy,
    });
    await sut.perform({ token });
    expect(createUserAccountByFacebookRepositorySpy.data).toEqual(
      createUserData
    );
    expect(createUserAccountByFacebookRepositorySpy.callsCount).toBe(1);
  });
});
