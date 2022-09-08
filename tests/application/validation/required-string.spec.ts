import { RequiredFieldError } from "@/application/errors";
import { RequiredStringValidator } from "@/application/validation";

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

  test("Should return undefined if value truthy", () => {
    const sut = new RequiredStringValidator("any_value", "any_field");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
