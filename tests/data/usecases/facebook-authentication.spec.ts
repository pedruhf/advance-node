import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthenticationUsecase } from "@/data/usecases";
import {
  CreateUserAccountByFacebookRepositorySpy,
  LoadFacebookUserApiSpy,
  LoadUserAccountByEmailRepositorySpy,
  UpdateFacebookUserAccountRepositorySpy,
} from "@/tests/data/mocks";

type SutTypes = {
  sut: FacebookAuthenticationUsecase;
  loadFacebookUserApiSpy: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepositorySpy: LoadUserAccountByEmailRepositorySpy;
  createUserAccountByFacebookRepositorySpy: CreateUserAccountByFacebookRepositorySpy;
  updateFacebookUserAccountRepositorySpy: UpdateFacebookUserAccountRepositorySpy;
};

type SutParams = {
  loadFacebookUserApiSpy?: LoadFacebookUserApiSpy;
  loadUserAccountByEmailRepositorySpy?: LoadUserAccountByEmailRepositorySpy;
  createUserAccountByFacebookRepositorySpy?: CreateUserAccountByFacebookRepositorySpy;
  updateFacebookUserAccountRepositorySpy?: UpdateFacebookUserAccountRepositorySpy;
};

const makeSut = ({
  loadFacebookUserApiSpy = new LoadFacebookUserApiSpy(),
  loadUserAccountByEmailRepositorySpy = new LoadUserAccountByEmailRepositorySpy(),
  createUserAccountByFacebookRepositorySpy = new CreateUserAccountByFacebookRepositorySpy(),
  updateFacebookUserAccountRepositorySpy = new UpdateFacebookUserAccountRepositorySpy(),
}: SutParams = {}): SutTypes => {
  const sut = new FacebookAuthenticationUsecase(
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepositorySpy,
    createUserAccountByFacebookRepositorySpy,
    updateFacebookUserAccountRepositorySpy
  );

  return {
    sut,
    loadFacebookUserApiSpy,
    loadUserAccountByEmailRepositorySpy,
    createUserAccountByFacebookRepositorySpy,
    updateFacebookUserAccountRepositorySpy,
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

  test("Should call LoadUserAccountByEmailRepository when LoadFacebookUserApi returns data", async () => {
    const { sut, loadUserAccountByEmailRepositorySpy } = makeSut();
    await sut.perform({ token });
    expect(loadUserAccountByEmailRepositorySpy.email).toBe(email);
    expect(loadUserAccountByEmailRepositorySpy.callsCount).toBe(1);
  });

  test("Should call CreateUserAccountByFacebookRepositorySpy when LoadUserAccountByEmailRepository returns undefined", async () => {
    const loadUserAccountByEmailRepositorySpy =
      new LoadUserAccountByEmailRepositorySpy();
    loadUserAccountByEmailRepositorySpy.result = undefined;
    const { sut, createUserAccountByFacebookRepositorySpy } = makeSut({
      loadUserAccountByEmailRepositorySpy,
    });
    await sut.perform({ token });
    expect(createUserAccountByFacebookRepositorySpy.data).toEqual(
      facebookUserData
    );
    expect(createUserAccountByFacebookRepositorySpy.callsCount).toBe(1);
  });

  test("Should call UpdateFacebookUserAccountRepositorySpy when LoadUserAccountByEmailRepository returns data", async () => {
    const { sut, updateFacebookUserAccountRepositorySpy } = makeSut();
    await sut.perform({ token });
    expect(updateFacebookUserAccountRepositorySpy.data).toEqual({
      id: "any_id",
      name: "any_name",
      facebookId: "any_facebook_id",
    });
    expect(updateFacebookUserAccountRepositorySpy.callsCount).toBe(1);
  });

  test("Should update account name when LoadUserAccountByEmailRepository not returns a name", async () => {
    const loadUserAccountByEmailRepositorySpy =
      new LoadUserAccountByEmailRepositorySpy();
    loadUserAccountByEmailRepositorySpy.result = {
      id: "any_id",
    };
    const { sut, updateFacebookUserAccountRepositorySpy } = makeSut({
      loadUserAccountByEmailRepositorySpy,
    });
    await sut.perform({ token });
    expect(updateFacebookUserAccountRepositorySpy.data).toEqual({
      id: "any_id",
      name: "any_facebook_name",
      facebookId: "any_facebook_id",
    });
    expect(updateFacebookUserAccountRepositorySpy.callsCount).toBe(1);
  });
});
