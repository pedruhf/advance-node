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
  test("Should calls HttpGetClient with correct params", async () => {
    const { sut, htpGetClientSpy } = makeSut();

    await sut.loadUser({ token: "any_client_token" });

    expect(htpGetClientSpy.url).toBe(
      "https://graph.facebook.com/oauth/access_token"
    );
    expect(htpGetClientSpy.params).toEqual({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });
  });
});
