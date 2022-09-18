import { TokenValidator } from "@/data/contracts/crypto";
import { Authorize } from "@/data/contracts/middlewares";

export class AuthorizeUseCase implements Authorize {
  constructor(private readonly tokenValidator: TokenValidator) {}

  async perform({ token }: Authorize.Input): Promise<Authorize.Output> {
    const userId = await this.tokenValidator.validateToken({ token });
    return userId;
  }
}
