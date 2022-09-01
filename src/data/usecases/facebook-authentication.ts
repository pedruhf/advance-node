import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import {
  SaveFacebookAccountRepo,
  LoadUserAccountByEmailRepo,
} from "@/data/repos";

export class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountByEmailRepo &
      SaveFacebookAccountRepo
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError | undefined> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (!fbData) {
      return new AuthenticationError();
    }
    const accountData = await this.userAccount.loadUser({
      email: fbData?.email,
    });
    await this.userAccount.saveWithFacebook({
      id: accountData?.id,
      name: accountData?.name ?? fbData.name,
      email: fbData.email,
      facebookId: fbData.facebookId,
    });
  }
}
