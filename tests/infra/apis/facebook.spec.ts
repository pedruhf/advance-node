import { LoadFacebookUserApi } from "@/data/contracts/apis";

class FacebookApi {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(private readonly httpGetClient: HttpGetClient) {}

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
    });
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>;
}

namespace HttpGetClient {
  export type Params = {
    url: string;
  };
}

class HttpGetClientSpy implements HttpGetClient {
  url?: string;

  async get(params: HttpGetClient.Params): Promise<void> {
    this.url = params.url;
  }
}

describe("FacebookApi", () => {
  test("Should get app token", async () => {
    const htpGetClientSpy = new HttpGetClientSpy();
    const sut = new FacebookApi(htpGetClientSpy);

    await sut.loadUser({ token: "any_client_token" });

    expect(htpGetClientSpy.url).toBe(
      "https://graph.facebook.com/oauth/access_token"
    );
  });
});
