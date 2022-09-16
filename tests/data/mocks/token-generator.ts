import { TokenGenerator } from "@/data/contracts/crypto";

export class TokenGeneratorSpy implements TokenGenerator {
  callsCount = 0;
  data?: TokenGenerator.Params;
  result = "any_generated_token";

  async generateToken(
    params: TokenGenerator.Params
  ): Promise<TokenGenerator.Result> {
    this.callsCount++;
    this.data = params;
    return this.result;
  }
}
