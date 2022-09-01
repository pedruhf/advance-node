import { LoadFacebookUserApi } from "@/data/contracts/apis";

export class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result?: LoadFacebookUserApi.Result = {
    name: "any_facebook_name",
    email: "any_facebook_email",
    facebookId: "any_facebook_id",
  };

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}
