import { RequiredFieldError } from "@/application/errors";
import { badRequest, HttpResponse, HttpStatusCode, success } from "@/application/helpers";
import { ChangeProfilePicture } from "@/data/use-cases";

type HttpRequest = { userId: string; file: { buffer: Buffer; mimeType: string } };
type Model = { pictureUrl?: string; initials?: string } | Error;

class SaveProfilePicture {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {}
  
  async handle({ userId, file }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!file) {
      return badRequest(new RequiredFieldError("foto"));
    }
    if (file.buffer.length === 0) {
      return badRequest(new RequiredFieldError("foto"));
    }
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(["png", "jpg", "jpeg"]));
    }
    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5));
    }
    const data = await this.changeProfilePicture({ userId, file: file.buffer });
    return success(data);
  }
}

class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Tipo não suportado. Tipos permitidos: ${allowed.join(", ")}`);
    this.name = "InvalidMimeTypeError";
  }
}

class MaxFileSizeError extends Error {
  constructor(maxSizeInMB: number) {
    super(`O tamanho máximo suportado para este tipo de arquivo é ${maxSizeInMB}MB`);
    this.name = "MaxFileSizeError";
  }
}

describe("SaveProfilePicture Controller", () => {
  let sut: SaveProfilePicture;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer, mimeType: string };
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
      data: { initials: "any_initials", pictureUrl: "any_url" }
    });
  });
});
