import { LoadFacebookUser } from "@/data/contracts/gateways";
import { HttpGetClient } from "@/infra/http";

type AppToken = {
  access_token: string;
};

type DebugToken = {
  data: {
    user_id: string;
  };
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
};

export class FacebookApi implements LoadFacebookUser {
  private readonly baseUrl = "https://graph.facebook.com";
  constructor(private readonly httpGetClient: HttpGetClient, private readonly clientId: string, private readonly clientSecret: string) {}

  async loadUser({ token }: LoadFacebookUser.Params): Promise<LoadFacebookUser.Result> {
    try {
      const { id, email, name } = await this.getUserInfo(token);

      return {
        facebookId: id,
        name,
        email,
      };
    } catch {
      return undefined;
    }
  }

  private async getAppToken(): Promise<AppToken> {
    return this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const { access_token } = await this.getAppToken();
    return this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: access_token,
        input_token: clientToken,
      },
    });
  }

  private async getUserInfo(clientToken: string): Promise<UserInfo> {
    const { data } = await this.getDebugToken(clientToken);
    return this.httpGetClient.get({
      url: `${this.baseUrl}/${data.user_id}`,
      params: {
        fields: ["id", "name", "email"].join(","),
        access_token: clientToken,
      },
    });
  }
}
