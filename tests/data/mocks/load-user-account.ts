import { LoadUserAccountByEmailRepository } from "@/data/repos";

export class LoadUserAccountByEmailRepositorySpy
  implements LoadUserAccountByEmailRepository
{
  email?: string;
  callsCount = 0;

  async load(params: LoadUserAccountByEmailRepository.Params): Promise<void> {
    this.email = params.email;
    this.callsCount++;
  }
}
