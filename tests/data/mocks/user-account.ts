import {
  LoadUserAccountByEmailRepo,
  SaveFacebookAccountRepo,
} from "@/data/repos";

export class UserAccountSpy
  implements LoadUserAccountByEmailRepo, SaveFacebookAccountRepo
{
  loadUserEmail?: string;
  loadUserCallsCount = 0;
  loadUserResult?: LoadUserAccountByEmailRepo.Result = {
    id: "any_id",
    name: "any_name",
  };

  saveWithFacebookData?: SaveFacebookAccountRepo.Params;
  saveWithFacebookCallsCount = 0;

  async loadUser(
    params: LoadUserAccountByEmailRepo.Params
  ): Promise<LoadUserAccountByEmailRepo.Result> {
    this.loadUserCallsCount++;
    this.loadUserEmail = params.email;
    return this.loadUserResult;
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepo.Params
  ): Promise<SaveFacebookAccountRepo.Result> {
    this.saveWithFacebookCallsCount++;
    this.saveWithFacebookData = params;
  }
}
