import { ValidationComposite } from "@/application/validation";
import { ValidatorSpy } from "@/tests/application/mocks/validation";

type SutTypes = {
  sut: ValidationComposite;
};

const makeSut = (validators: ValidatorSpy[] = []): SutTypes => {
  const sut = new ValidationComposite(validators);

  return {
    sut,
  };
};

describe("ValidationComposite", () => {
  test("Should return undefined if all Validators return undefined", () => {
    const validator1 = new ValidatorSpy();
    jest.spyOn(validator1, "validate").mockReturnValueOnce(undefined);
    const validator2 = new ValidatorSpy();
    jest.spyOn(validator2, "validate").mockReturnValueOnce(undefined);
    const validators = [validator1, validator2];

    const { sut } = makeSut(validators);
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  test("Should return the first error", () => {
    const error1 = new Error("error_1");
    const error2 = new Error("error_2");

    const validator1 = new ValidatorSpy();
    jest.spyOn(validator1, "validate").mockReturnValueOnce(error1);
    const validator2 = new ValidatorSpy();
    jest.spyOn(validator2, "validate").mockReturnValueOnce(error2);
    const validators = [validator1, validator2];

    const { sut } = makeSut(validators);
    const error = sut.validate();

    expect(error).toEqual(error1);
  });

  test("Should return error", () => {
    const error2 = new Error("error_2");

    const validator1 = new ValidatorSpy();
    const validator2 = new ValidatorSpy();
    jest.spyOn(validator2, "validate").mockReturnValueOnce(error2);
    const validators = [validator1, validator2];

    const { sut } = makeSut(validators);
    const error = sut.validate();

    expect(error).toEqual(error2);
  });
});
