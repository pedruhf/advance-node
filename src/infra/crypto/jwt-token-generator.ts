import jwt from "jsonwebtoken";

import { TokenGenerator } from "@/data/contracts/crypto";

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secretKey: string) {}

  async generate(
    params: TokenGenerator.Params
  ): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secretKey, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}
