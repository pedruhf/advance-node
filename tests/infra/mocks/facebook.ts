import { HttpGetClient } from "@/infra/http";

export class HttpGetClientSpy implements HttpGetClient {
  url?: string;
  params?: any;

  async get(params: HttpGetClient.Params): Promise<void> {
    this.url = params.url;
    this.params = params.params;
  }
}
