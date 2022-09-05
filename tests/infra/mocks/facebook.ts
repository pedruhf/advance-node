import { HttpGetClient } from "@/infra/http";

export class HttpGetClientSpy implements HttpGetClient {
  url?: string;
  params?: any;
  result: any = {
    access_token: "any_app_token",
  };

  async get(params: HttpGetClient.Params): Promise<HttpGetClient.Result> {
    this.url = params.url;
    this.params = params.params;
    return this.result;
  }
}
