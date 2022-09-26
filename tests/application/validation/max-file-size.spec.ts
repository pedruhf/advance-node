import { MaxFileSizeError } from "@/application/errors";
import { MaxFileSizeValidator } from "@/application/validation";

describe("MaxFileSize Validator", () => {
  test("Should return InvalidMimeTypeError if value is invalid", () => {
    const invalid_buffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024)); // 6MB
    const sut = new MaxFileSizeValidator(5, invalid_buffer);
    const error = sut.validate();

    expect(error).toEqual(new MaxFileSizeError(5));
  });

  test("Should return undefined if value is valid", () => {
    const valid_buffer = Buffer.from(new ArrayBuffer(4 * 1024 * 1024)); // 4MB
    const sut = new MaxFileSizeValidator(5, valid_buffer);
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  test("Should return undefined if value is valid", () => {
    const valid_buffer = Buffer.from(new ArrayBuffer(5 * 1024 * 1024)); // 5MB
    const sut = new MaxFileSizeValidator(5, valid_buffer);
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
