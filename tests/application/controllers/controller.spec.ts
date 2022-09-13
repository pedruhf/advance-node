import { ServerError } from "@/application/errors";
import { ValidationComposite } from "@/application/validation";
import { ControllerStub } from "@/tests/application/mocks";

jest.mock("@/application/validation/composite");

type SutTypes = {
  sut: ControllerStub;
};

const makeSut = (): SutTypes => {
  const sut = new ControllerStub();

  return {
    sut,
  };
};

describe("FacebookLoginController", () => {
  it("Should return 400 if validation fails", async () => {
    const error = new Error("validation_error");
    const validationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error),
    }));
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(validationCompositeSpy);

    const { sut } = makeSut();
    const httpResponse = await sut.handle("any_value");

    expect(ValidationComposite).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  test("Should return 500 if perform throws", async () => {
    const error = new Error("perform_error");
    const { sut } = makeSut();
    jest.spyOn(sut, "perform").mockRejectedValueOnce(error);

    const httpResponse = await sut.handle("any_value");

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  test("Should return the same result as perform", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle("any_value");

    expect(httpResponse).toEqual(sut.result);
  });
});
