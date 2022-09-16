import { AccessToken, FacebookAccount } from "@/domain/entities";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import { SaveFacebookAccountRepo, LoadUserAccountByEmailRepo } from "@/data/repos";
import { TokenGenerator } from "@/data/contracts/crypto";

type PerformInput = FacebookAuthentication.Params;
type PerformOutput = FacebookAuthentication.Result;

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly userAccount: LoadUserAccountByEmailRepo & SaveFacebookAccountRepo,
    private readonly tokenGenerator: TokenGenerator
  ) {}
  async perform(params: PerformInput): Promise<PerformOutput> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (!fbData) {
      throw new AuthenticationError();
    }
    const accountData = await this.userAccount.load({ email: fbData?.email });
    const facebookAccount = new FacebookAccount(fbData, accountData);
    const { id } = await this.userAccount.saveWithFacebook(facebookAccount);
    const token = await this.tokenGenerator.generate({
      key: id,
      expirationInMs: AccessToken.expirationInMs,
    });
    return { accessToken: token };
  }
}
