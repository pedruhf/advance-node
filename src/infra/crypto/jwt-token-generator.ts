import jwt from "jsonwebtoken";

import { TokenGenerator } from "@/data/contracts/crypto";

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly secretKey: string) {}

  async generate({ key, expirationInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    const token = jwt.sign({ key }, this.secretKey, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }
}
