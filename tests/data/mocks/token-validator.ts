import { TokenValidator } from "@/data/contracts/crypto";

export class TokenValidatorSpy implements TokenValidator {
  public callsCount = 0;
  public input?: TokenValidator.Params;
  public output: TokenValidator.Result = "any_id";

  async validate(params: TokenValidator.Params): Promise<TokenValidator.Result> {
    this.callsCount++;
    this.input = params;

    return this.output;
  }
}
