import { FacebookApi } from "@/infra/apis";
import { HttpGetClientSpy } from "@/tests/infra/mocks";

type SutTypes = {
  sut: FacebookApi;
  htpGetClientSpy: HttpGetClientSpy;
};

const clientId = "any_client_id";
const clientSecret = "any_client_secret";

const makeSut = (): SutTypes => {
  const htpGetClientSpy = new HttpGetClientSpy();
  const sut = new FacebookApi(htpGetClientSpy, clientId, clientSecret);

  return {
    sut,
    htpGetClientSpy,
  };
};

describe("FacebookApi", () => {
  test("Should get app token", async () => {
    const { sut, htpGetClientSpy } = makeSut();
    const getSpy = jest.spyOn(htpGetClientSpy, "get");

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
    const { sut, htpGetClientSpy } = makeSut();
    const getSpy = jest.spyOn(htpGetClientSpy, "get");

    await sut.loadUser({ token: "any_client_token" });

    expect(getSpy).toHaveBeenCalledWith({
      url: "https://graph.facebook.com/debug_token",
      params: {
        access_token: "any_app_token",
        input_token: "any_client_token",
      },
    });
  });
});
