import {
  LoadUserAccountByEmailRepo,
  SaveFacebookAccountRepo,
} from "@/data/repos";

export class LoadUserAccountByEmailRepoSpy
  implements LoadUserAccountByEmailRepo
{
  email?: string;
  callsCount = 0;
  result?: LoadUserAccountByEmailRepo.Result = {
    id: "any_id",
    name: "any_name",
  };

  async load(
    params: LoadUserAccountByEmailRepo.Params
  ): Promise<LoadUserAccountByEmailRepo.Result> {
    this.email = params.email;
    this.callsCount++;
    return this.result;
  }
}

export class SaveFacebookAccountRepoSpy implements SaveFacebookAccountRepo {
  data?: SaveFacebookAccountRepo.Params;
  callsCount = 0;

  async saveWithFacebook(
    params: SaveFacebookAccountRepo.Params
  ): Promise<SaveFacebookAccountRepo.Result> {
    this.callsCount++;
    this.data = params;
  }
}
