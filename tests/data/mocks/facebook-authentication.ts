import { LoadFacebookUser } from "@/data/contracts/gateways";
import { fbModelMock } from "@/tests/domain/mocks";

export class LoadFacebookUserApiSpy implements LoadFacebookUser {
  token?: string;
  callsCount = 0;
  result?: LoadFacebookUser.Result = fbModelMock();

  async loadUser(
    params: LoadFacebookUser.Params
  ): Promise<LoadFacebookUser.Result> {
    this.token = params.token;
    this.callsCount++;
    return this.result;
  }
}
