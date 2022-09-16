import jwt from "jsonwebtoken";

import { TokenGenerator, TokenValidator } from "@/data/contracts/crypto";

export class JwtTokenHandler implements TokenGenerator {
  constructor(private readonly secretKey: string) {}

  async generateToken({ key, expirationInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    const token = jwt.sign({ key }, this.secretKey, {
      expiresIn: expirationInSeconds,
    });

    return token;
  }

  async validateToken({ token }: TokenValidator.Params): Promise<void> {
    jwt.verify(token, this.secretKey);
  }
}
