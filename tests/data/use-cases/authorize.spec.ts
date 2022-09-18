import { AuthorizeUseCase } from "@/data/use-cases";
import { TokenValidatorSpy } from "@/tests/data/mocks";

type SutTypes = {
  sut: AuthorizeUseCase;
  tokenValidatorSpy: TokenValidatorSpy;
};

const token = "any_token";
const makeSut = (): SutTypes => {
  const tokenValidatorSpy = new TokenValidatorSpy();
  const sut = new AuthorizeUseCase(tokenValidatorSpy);

  return {
    sut,
    tokenValidatorSpy,
  };
};

describe("Authorize UseCase", () => {
  test("Should call TokenValidator with correct params", async () => {
    const { sut, tokenValidatorSpy } = makeSut();
    await sut.perform({ token });

    expect(tokenValidatorSpy.input).toEqual({ token });
  });

  test("Should return the correct accessToken", async () => {
    const { sut } = makeSut();
    const userId = await sut.perform({ token });

    expect(userId).toBe("any_id");
  });
});
