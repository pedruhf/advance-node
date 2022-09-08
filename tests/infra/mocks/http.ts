import { HttpGetClient } from "@/infra/http";

export class HttpGetClientSpy implements HttpGetClient {
  url?: string;
  params?: any;
  result = {
    access_token: "any_app_token",
    data: { user_id: "any_user_id" },
    id: "any_facebook_id",
    name: "any_facebook_name",
    email: "any_facebook_email",
  };

  async get(params: HttpGetClient.Params): Promise<any> {
    this.url = params.url;
    this.params = params.params;
    return this.result;
  }
}
