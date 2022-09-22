import { FacebookApi } from "@/infra/gateways";
import { env } from "@/main/config/env";
import { makeAxiosHttpClient } from "@/main/factories/gateways";

export const makeFacebookApi = (): FacebookApi => {
  const axiosHttpClient = makeAxiosHttpClient();
  return new FacebookApi(axiosHttpClient, env.facebookApi.clientId, env.facebookApi.clientSecret);
};
