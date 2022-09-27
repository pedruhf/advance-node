import { Controller } from "@/application/controllers";
import { SaveProfilePicture } from "@/application/controllers/save-profile-picture";
import { HttpStatusCode } from "@/application/helpers";
import { AllowedMimeTypesValidator, MaxFileSizeValidator, RequiredBufferValidator, RequiredValidator } from "@/application/validation";

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

  test("Should build Validators correctly", async () => {
    const validators = sut.buildValidators({ file, userId });

    expect(validators).toEqual([
      new RequiredValidator(file, "foto"),
      new RequiredBufferValidator(buffer, "foto"),
      new AllowedMimeTypesValidator(["png", "jpg"], mimeType),
      new MaxFileSizeValidator(5, buffer)
    ]);
  });

  test("Should call changeProfilePicture with correct input", async () => {
    await sut.handle({ file, userId });

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId, file });
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
