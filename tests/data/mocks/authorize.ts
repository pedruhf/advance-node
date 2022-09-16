import { Authorize } from "@/data/contracts/middlewares";

export class AuthorizeSpy implements Authorize {
  public callsCount = 0;
  public input?: Authorize.Input;

  async perform(input: Authorize.Input): Promise<Authorize.Output> {
    this.callsCount++;
    this.input = input;
    return "";
  }
}
