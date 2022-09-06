import jwt from "jsonwebtoken";

import { TokenGenerator } from "@/data/contracts/crypto";

jest.mock("jsonwebtoken");

class JwtTokenGenerator {
  constructor(private readonly secretKey: string) {}

  async generate(params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000;
    jwt.sign({ key: params.key }, this.secretKey, {
      expiresIn: expirationInSeconds,
    });
  }
}

describe("JwtTokenGenerator", () => {
  const fakeJwt = jwt as jest.Mocked<typeof jwt>;

  test("Should call sign with correct params", async () => {
    const sut = new JwtTokenGenerator("any_secret");
    await sut.generate({ key: "any_key", expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: "any_key" },
      "any_secret",
      { expiresIn: 1 }
    );
  });
});
