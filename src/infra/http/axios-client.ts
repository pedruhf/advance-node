import axios from "axios";

import { HttpGetClient } from "@/infra/http";

export class AxiosHttpClient {
  async get<T = any>(params: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params });
    return result.data;
  }
}