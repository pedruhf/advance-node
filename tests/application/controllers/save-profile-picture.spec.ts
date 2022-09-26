import { Controller } from "@/application/controllers";
import { SaveProfilePicture } from "@/application/controllers/save-profile-picture";
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from "@/application/errors";
import { HttpStatusCode } from "@/application/helpers";

describe("SaveProfilePicture Controller", () => {
  let sut: SaveProfilePicture;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let userId: string;
  let changeProfilePicture: jest.Mock;

  beforeAll(() => {
    buffer = Buffer.from("any_buffer");
    mimeType = "image/png";
    file = { buffer, mimeType };
    userId = "any_user_id";
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: "any_initials", pictureUrl: "any_url" });
  });

  beforeEach(() => {
    sut = new SaveProfilePicture(changeProfilePicture);
  });

  test("Should extend Controller", async () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  test("Should return 400 if file is not provided", async () => {
    const httpResponse = await sut.handle({ userId, file: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });

  test("Should return 400 if file is not provided", async () => {
    const httpResponse = await sut.handle({ userId, file: null as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });

  test("Should return 400 if file is empty", async () => {
    const httpResponse = await sut.handle({ userId, file: { buffer: Buffer.from(""), mimeType } });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });

  test("Should return 400 if file type is invalid", async () => {
    const httpResponse = await sut.handle({ userId, file: { buffer, mimeType: "invalid_type" } });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new InvalidMimeTypeError(["png", "jpg", "jpeg"]),
    });
  });

  test("Should return 400 if file type is valid", async () => {
    const httpResponse = await sut.handle({ userId, file: { buffer, mimeType: "image/png" } });

    expect(httpResponse).not.toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new InvalidMimeTypeError(["png", "jpg", "jpeg"]),
    });
  });

  test("Should not return 400 if file type is valid", async () => {
    const httpResponse = await sut.handle({ userId, file: { buffer, mimeType: "image/jpg" } });

    expect(httpResponse).not.toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new InvalidMimeTypeError(["png", "jpg", "jpeg"]),
    });
  });

  test("Should not return 400 if file type is valid", async () => {
    const httpResponse = await sut.handle({ userId, file: { buffer, mimeType: "image/jpeg" } });

    expect(httpResponse).not.toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new InvalidMimeTypeError(["png", "jpg", "jpeg"]),
    });
  });

  test("Should return 400 if file size is bigger than 5MB", async () => {
    const invalid_buffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024)); // 6MB
    const httpResponse = await sut.handle({ userId, file: { buffer: invalid_buffer, mimeType } });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new MaxFileSizeError(5),
    });
  });

  test("Should call changeProfilePicture with correct input", async () => {
    await sut.handle({ file, userId });

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId, file: buffer });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  test("Should return 200 with valid data", async () => {
    const httpResponse = await sut.handle({ file, userId });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.ok,
      data: { initials: "any_initials", pictureUrl: "any_url" },
    });
  });
});
