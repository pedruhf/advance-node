import { InvalidMimeTypeError } from "@/application/errors";
import { AllowedMimeTypesValidator } from "@/application/validation";

describe("AllowedMimeTypes Validator", () => {
  test("Should return InvalidMimeTypeError if value is invalid", () => {
    const sut = new AllowedMimeTypesValidator(["png"], "image/jpg");
    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(["png"]));
  });

  test("Should return undefined if value is valid", () => {
    const sut = new AllowedMimeTypesValidator(["png"], "image/png");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  test("Should return undefined if value is valid", () => {
    const sut = new AllowedMimeTypesValidator(["jpg"], "image/jpg");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  test("Should return undefined if value is valid", () => {
    const sut = new AllowedMimeTypesValidator(["jpg"], "image/jpeg");
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
