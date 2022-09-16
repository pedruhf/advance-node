class Authorize {
  constructor(private readonly token: string, private readonly tokenValidator: TokenValidator) {}

  async perform(): Promise<void> {
    await this.tokenValidator.validate({ token: this.token });
  }
}

export interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<TokenValidator.Result>;
}

export namespace TokenValidator {
  export type Params = { token: string };
  export type Result = void;
}

class TokenValidatorSpy implements TokenValidator {
  public callsCount = 0;
  public params?: TokenValidator.Params;

  async validate(params: TokenValidator.Params): Promise<TokenValidator.Result> {
    this.callsCount++;
    this.params = params;
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

    expect(tokenValidatorSpy.params).toEqual({ token });
  });
});
