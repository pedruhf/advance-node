import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { fbModelMock } from "../../domain/mocks";

export class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;
  callsCount = 0;
  result?: LoadFacebookUserApi.Result = fbModelMock();

  async loadUser(
    params: LoadFacebookUserApi.Params
  ): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}
