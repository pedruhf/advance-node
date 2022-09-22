import { FacebookApi } from "@/infra/gateways";
import { AxiosHttpClient } from "@/infra/gateways";
import { env } from "@/main/config/env";

type SutTypes = {
  sut: FacebookApi;
  axiosClient: AxiosHttpClient;
};

const makeSut = (): SutTypes => {
  const axiosClient = new AxiosHttpClient();
  const sut = new FacebookApi(
    axiosClient,
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  );

  return {
    sut,
    axiosClient,
  };
};

describe("Facebook API Integration Test", () => {
  test("Should return a Facebook User if token is valid", async () => {
    const { sut } = makeSut();
    const fbUser = await sut.loadUser({
      token:
        // eslint-disable-next-line max-len
        "EAAGzyzBSZAZBsBAAZCY925qjqTmFbSacwO63BgZAM4HkmMvL7gD3PFJ6Xv7v3c5ghggq7LlRLPKJ6FoKWVHSoRFIhj1fY2x5hJgmNvkJvpT2OqqPeMKUo8l3hRbT7ZCel6sa6KT3k0YLDnhNkyiQLaOMD95aYWZC03LYmHbdfuIXbBFOSZB1q9KGO1p7rB7RVYj4DZAovsDRnAZDZD",
    });

    expect(fbUser).toEqual({
      facebookId: "109792411875504",
      email: "pedro_kchbkry_teste@tfbnw.net",
      name: "Pedro Teste",
    });
  });

  test("Should return undefined if token is invalid", async () => {
    const { sut } = makeSut();
    const fbUser = await sut.loadUser({
      token: "invalid_token",
    });

    expect(fbUser).toBeUndefined();
  });
});
