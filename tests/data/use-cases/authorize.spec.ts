import { Authorize } from "@/data/use-cases";
import { TokenValidatorSpy } from "@/tests/data/mocks";

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
