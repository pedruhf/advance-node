import {
  CreateUserAccountByFacebookRepository,
  LoadUserAccountByEmailRepository,
} from "@/data/repos";

export class LoadUserAccountByEmailRepositorySpy
  implements LoadUserAccountByEmailRepository
{
  email?: string;
  callsCount = 0;
  result? = undefined;

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
