import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadFacebookUserApi } from "@/data/contracts/apis/facebook";
import {
  CreateUserAccountByFacebookRepository,
  LoadUserAccountByEmailRepository,
} from "@/data/repos";

export class FacebookAuthenticationUsecase {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountByEmailRepository: LoadUserAccountByEmailRepository,
    private readonly createUserAccountByFacebookRepository: CreateUserAccountByFacebookRepository
  ) {}
  async perform(
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.loadFacebookUserApi.loadUser(params);
    if (fbData) {
      await this.loadUserAccountByEmailRepository.load({
        email: fbData?.email,
      });
      await this.createUserAccountByFacebookRepository.create(fbData);
    }
    return new AuthenticationError();
  }
}
