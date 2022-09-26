import { InvalidMimeTypeError } from "@/application/errors";

type Extension = "png" | "jpg";

class AllowedMimeTypesValidator {
  constructor(private readonly allowed: Extension[], private readonly mimeType: string) {}

  validate(): Error | undefined {
    return new InvalidMimeTypeError(this.allowed);
  }
}

describe("AllowedMimeTypes Validator", () => {
  test("Should return InvalidMimeTypeError if value is invalid", () => {
    const sut = new AllowedMimeTypesValidator(["png"], "image/jpg");
    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(["png"]));
  });
});
