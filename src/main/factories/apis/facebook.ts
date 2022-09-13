import { FacebookApi } from "@/infra/apis";
import { env } from "@/main/config/env";
import { makeAxiosHttpClient } from "@/main/factories/http";

export const makeFacebookApi = (): FacebookApi => {
  const axiosHttpClient = makeAxiosHttpClient();
  return new FacebookApi(axiosHttpClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
};
