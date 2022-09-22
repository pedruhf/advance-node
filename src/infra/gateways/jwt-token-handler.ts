import jwt, { JwtPayload } from "jsonwebtoken";

import { TokenGenerator, TokenValidator } from "@/data/contracts/gateways";

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor(private readonly secretKey: string) {}

  async generate({ key, expirationInMs }: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = expirationInMs / 1000;
    const token = jwt.sign({ key }, this.secretKey, {
      expiresIn: expirationInSeconds,
    });
    return token;
  }

  async validate({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(token, this.secretKey) as JwtPayload;
    return payload?.key;
  }
}
