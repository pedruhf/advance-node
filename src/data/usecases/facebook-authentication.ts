import { AccessToken, FacebookAccount } from "@/domain/models";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import {
  SaveFacebookAccountRepo,
  LoadUserAccountByEmailRepo,
} from "@/data/repos";
import { TokenGenerator } from "@/data/contracts/crypto";

export class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountByEmailRepo &
      SaveFacebookAccountRepo,
    private readonly tokenGenerator: TokenGenerator
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
    const { id } = await this.userAccount.saveWithFacebook(facebookAccount);
    await this.tokenGenerator.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
  }
}
