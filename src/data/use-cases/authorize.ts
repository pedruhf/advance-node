import { TokenValidator } from "@/data/contracts/crypto";

export class Authorize {
  constructor(private readonly token: string, private readonly tokenValidator: TokenValidator) {}

  async perform(): Promise<string> {
    const userId = await this.tokenValidator.validate({ token: this.token });
    return userId;
  }
}
