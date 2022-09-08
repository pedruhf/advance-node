import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";

export class FacebookAuthenticationSpy implements FacebookAuthentication {
  callsCount = 0;
  data?: FacebookAuthentication.Params;
  result: FacebookAuthentication.Result = new AccessToken("any_token");

  async perform(
    params: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    this.callsCount++;
    this.data = params;
    return this.result;
  }
}
