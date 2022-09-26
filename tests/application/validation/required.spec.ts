import { RequiredFieldError } from "@/application/errors";
import { RequiredStringValidator, RequiredValidator } from "@/application/validation";

describe("RequiredValidator", () => {
  test("Should return RequiredFieldError if value is null", () => {
    const sut = new RequiredValidator(<any>null, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });

  test("Should return RequiredFieldError if value is undefined", () => {
    const sut = new RequiredValidator(<any>undefined, "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });

  test("Should return undefined if value is truthy", () => {
    const sut = new RequiredValidator("any_value", "any_field");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});

describe("RequiredStringValidator", () => {
  test("Should extend RequiredValidator", () => {
    const sut = new RequiredStringValidator("", "any_field");

    expect(sut).toBeInstanceOf(RequiredValidator);
  });

  test("Should return RequiredFieldError if value is empty", () => {
    const sut = new RequiredStringValidator("", "any_field");
    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError("any_field"));
  });

  test("Should return undefined if value is truthy", () => {
    const sut = new RequiredStringValidator("any_value", "any_field");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
