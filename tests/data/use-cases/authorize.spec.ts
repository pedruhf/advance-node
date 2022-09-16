class Authorize {
  constructor(private readonly token: string, private readonly tokenValidator: TokenValidator) {}

  async perform(): Promise<string> {
    const userId = await this.tokenValidator.validate({ token: this.token });
    return userId;
  }
}

export interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>;
}

export namespace TokenValidator {
  export type Params = { token: string };
  export type Result = string;
}

class TokenValidatorSpy implements TokenValidator {
  public callsCount = 0;
  public input?: TokenValidator.Params;
  public output: TokenValidator.Result = "any_id";

  async validate(params: TokenValidator.Params): Promise<TokenValidator.Result> {
    this.callsCount++;
    this.input = params;

    return this.output;
  }
}

type SutTypes = {
  sut: Authorize;
  tokenValidatorSpy: TokenValidatorSpy;
};

const token = "any_token";
const makeSut = (): SutTypes => {
  const tokenValidatorSpy = new TokenValidatorSpy();
  const sut = new Authorize(token, tokenValidatorSpy);

  return {
    sut,
    tokenValidatorSpy,
  };
};

describe("Authorize UseCase", () => {
  test("Should call TokenValidator with correct params", async () => {
    const { sut, tokenValidatorSpy } = makeSut();
    await sut.perform();

    expect(tokenValidatorSpy.input).toEqual({ token });
  });

  test("Should return the correct accessToken", async () => {
    const { sut } = makeSut();
    const userId = await sut.perform();

    expect(userId).toBe("any_id");
  });
});
