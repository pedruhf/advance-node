import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import {
  CreateUserAccountByFacebookRepository,
  LoadUserAccountByEmailRepository,
  UpdateFacebookUserAccountRepository,
} from "@/data/repos";

export class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountByEmailRepository: LoadUserAccountByEmailRepository,
    private readonly createUserAccountByFacebookRepository: CreateUserAccountByFacebookRepository,
    private readonly updateFacebookUserAccountRepository: UpdateFacebookUserAccountRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (fbData) {
      const accountData = await this.loadUserAccountByEmailRepository.load({
        email: fbData?.email,
      });

      if (accountData) {
        await this.updateFacebookUserAccountRepository.update({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId,
        });
      } else {
        await this.createUserAccountByFacebookRepository.create(fbData);
      }
    }
    return new AuthenticationError();
  }
}
