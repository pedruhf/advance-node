import { RequiredFieldError } from "@/application/errors";

class RequiredStringValidator {
  constructor (private readonly value: string, private readonly fieldName: string) {}

  validate(): Error | undefined {
    return new RequiredFieldError(this.fieldName);
  }
}

describe("RequiredStringValidator", () => {
  test("Should return RequiredFieldError if value is empty", () => {
    const sut = new RequiredStringValidator("", "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });

  test("Should return RequiredFieldError if value is null", () => {
    const sut = new RequiredStringValidator(<any>null, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });

  test("Should return RequiredFieldError if value is undefined", () => {
    const sut = new RequiredStringValidator(<any>undefined, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });
});
