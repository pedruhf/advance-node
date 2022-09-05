import { FacebookApi } from "@/infra/apis";
import { HttpGetClientSpy } from "@/tests/infra/mocks";
import { fbModelMock } from "@/tests/domain/mocks";

type SutTypes = {
  sut: FacebookApi;
  httpGetClientSpy: HttpGetClientSpy;
};

const clientId = "any_client_id";
const clientSecret = "any_client_secret";

const makeSut = (): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy();
  const sut = new FacebookApi(httpGetClientSpy, clientId, clientSecret);

  return {
    sut,
    httpGetClientSpy,
  };
};

describe("FacebookApi", () => {
  test("Should get app token", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const getSpy = jest.spyOn(httpGetClientSpy, "get");

    await sut.loadUser({ token: "any_client_token" });

    expect(getSpy).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/oauth/access_token",
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      },
    });
  });

  test("Should get debug token", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const getSpy = jest.spyOn(httpGetClientSpy, "get");

    await sut.loadUser({ token: "any_client_token" });

    expect(getSpy).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/debug_token",
      params: {
        access_token: "any_app_token",
        input_token: "any_client_token",
      },
    });
  });

  test("Should get user info", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const getSpy = jest.spyOn(httpGetClientSpy, "get");

    await sut.loadUser({ token: "any_client_token" });

    expect(getSpy).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/any_user_id",
      params: {
        fields: "id,name,email",
        access_token: "any_client_token",
      },
    });
  });

  test("Should return facebook user", async () => {
    const { sut } = makeSut();

    const facebookUser = await sut.loadUser({ token: "any_client_token" });

    expect(facebookUser).toEqual(fbModelMock());
  });
});
