interface Validator {
  validate: () => Error | undefined;
}

class ValidatorSpy implements Validator {
  validate(): Error | undefined {
    return undefined;
  }
}

class ValidationComposite {
  constructor(private readonly validators: Validator[]) {}

  validate(): undefined {
    return undefined;
  }
}

describe("ValidationComposite", () => {
  test("Should return undefined if all Validators return undefined", () => {
    const validator1 = new ValidatorSpy();
    jest.spyOn(validator1, "validate").mockReturnValueOnce(undefined);
    const validator2 = new ValidatorSpy();
    jest.spyOn(validator2, "validate").mockReturnValueOnce(undefined);
    const validators = [validator1, validator2];

    const sut = new ValidationComposite(validators);
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
