import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import {
  SaveFacebookAccountRepo,
  LoadUserAccountByEmailRepo,
} from "@/data/repos";
import { FacebookAccount } from "@/domain/models";

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
    const facebookAccount = new FacebookAccount(fbData, accountData);
    await this.userAccount.saveWithFacebook(facebookAccount);
  }
}
