import { InvalidMimeTypeError } from "@/application/errors";

type Extension = "png" | "jpg";

class AllowedMimeTypesValidator {
  constructor(private readonly allowed: Extension[], private readonly mimeType: string) {}

  validate(): Error | undefined {
    if (this.isPng()) return;
    if (this.isJpg()) return;
    return new InvalidMimeTypeError(this.allowed);
  }

  private isPng(): boolean {
    return this.allowed.includes("png") && this.mimeType === "image/png";
  }

  private isJpg(): boolean {
    return this.allowed.includes("jpg") && /image\/jpe?g/.test(this.mimeType);
  }
}

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
