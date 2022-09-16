import { TokenValidator } from "@/data/contracts/crypto";
import { Authorize } from "@/data/contracts/middlewares";

export class AuthorizeUseCase implements Authorize {
  constructor(private readonly token: string, private readonly tokenValidator: TokenValidator) {}

  async perform(): Promise<string> {
    const userId = await this.tokenValidator.validate({ token: this.token });
    return userId;
  }
}
