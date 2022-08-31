import { LoadFacebookUserApi } from "@/data/contracts/apis";

export class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result? = undefined;

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}
