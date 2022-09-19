import { AccessToken, FacebookAccount } from "@/domain/entities";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUser } from "@/data/contracts/gateways/facebook";
import { SaveFacebookAccountRepo, LoadUserAccountByEmailRepo } from "@/data/contracts/repos";
import { TokenGenerator } from "@/data/contracts/gateways";

type PerformInput = FacebookAuthentication.Params;
type PerformOutput = FacebookAuthentication.Result;

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor(
    private readonly LoadFacebookUser: LoadFacebookUser,
    private readonly userAccount: LoadUserAccountByEmailRepo & SaveFacebookAccountRepo,
    private readonly token: TokenGenerator
  ) {}
  async perform(params: PerformInput): Promise<PerformOutput> {
    const fbData = await this.LoadFacebookUser.loadUser(params);
    if (!fbData) {
      throw new AuthenticationError();
    }
    const accountData = await this.userAccount.load({ email: fbData?.email });
    const facebookAccount = new FacebookAccount(fbData, accountData);
    const { id } = await this.userAccount.saveWithFacebook(facebookAccount);
    const token = await this.token.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    return { accessToken: token };
  }
}
