import { LoadFacebookUserApi } from "@/data/contracts/apis";

class FacebookApi {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(
    private readonly httpGetClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
    params: object;
  };
}

class HttpGetClientSpy implements HttpGetClient {
  url?: string;
  params?: any;

  async get(params: HttpGetClient.Params): Promise<void> {
    this.url = params.url;
    this.params = params.params;
  }
}

const clientId = "any_client_id";
const clientSecret = "any_client_secret";

type SutTypes = {
  sut: FacebookApi;
  htpGetClientSpy: HttpGetClientSpy;
}

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
