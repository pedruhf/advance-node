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
    private readonly loadUserAccountByEmailRepo: LoadUserAccountByEmailRepo,
    private readonly saveFacebookAccountRepo: SaveFacebookAccountRepo
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (fbData) {
      const accountData = await this.loadUserAccountByEmailRepo.load({
        email: fbData?.email,
      });
      await this.saveFacebookAccountRepo.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId,
      });
    }
    return new AuthenticationError();
  }
}
