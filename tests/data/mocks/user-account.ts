import {
  CreateUserAccountByFacebookRepository,
  LoadUserAccountByEmailRepository,
  UpdateFacebookUserAccountRepository,
} from "@/data/repos";

export class LoadUserAccountByEmailRepositorySpy
  implements LoadUserAccountByEmailRepository
{
  email?: string;
  callsCount = 0;
  result?: LoadUserAccountByEmailRepository.Result = {
    id: "any_id",
    name: "any_name",
  };

  async load(
    params: LoadUserAccountByEmailRepository.Params
  ): Promise<LoadUserAccountByEmailRepository.Result> {
    this.email = params.email;
    this.callsCount++;
    return this.result;
  }
}

export class CreateUserAccountByFacebookRepositorySpy
  implements CreateUserAccountByFacebookRepository
{
  data?: CreateUserAccountByFacebookRepository.Params;
  callsCount = 0;
  result? = undefined;

  async create(
    params: CreateUserAccountByFacebookRepository.Params
  ): Promise<CreateUserAccountByFacebookRepository.Result> {
    this.callsCount++;
    this.data = params;
  }
}

export class UpdateFacebookUserAccountRepositorySpy
  implements UpdateFacebookUserAccountRepository
{
  data?: UpdateFacebookUserAccountRepository.Params;
  callsCount = 0;
  result? = undefined;

  async update(
    params: UpdateFacebookUserAccountRepository.Params
  ): Promise<UpdateFacebookUserAccountRepository.Result> {
    this.callsCount++;
    this.data = params;
    return this.result;
  }
}
