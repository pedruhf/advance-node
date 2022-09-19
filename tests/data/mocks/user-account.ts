import {
  LoadUserAccountByEmailRepo,
  SaveFacebookAccountRepo,
} from "@/data/contracts/repos";

export class UserAccountSpy
  implements LoadUserAccountByEmailRepo, SaveFacebookAccountRepo
{
  loadEmail?: string;
  loadCallsCount = 0;
  loadResult?: LoadUserAccountByEmailRepo.Result = undefined;

  saveWithFacebookData?: SaveFacebookAccountRepo.Params;
  saveWithFacebookCallsCount = 0;
  saveWithFacebookResult: SaveFacebookAccountRepo.Result = {
    id: "any_account_id",
  };

  async load(
    params: LoadUserAccountByEmailRepo.Params
  ): Promise<LoadUserAccountByEmailRepo.Result> {
    this.loadCallsCount++;
    this.loadEmail = params.email;
    return this.loadResult;
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepo.Params
  ): Promise<SaveFacebookAccountRepo.Result> {
    this.saveWithFacebookCallsCount++;
    this.saveWithFacebookData = params;
    return this.saveWithFacebookResult;
  }
}
