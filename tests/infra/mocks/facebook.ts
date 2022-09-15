import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/entities";

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
