import { RequiredFieldError } from "@/application/errors";
import { badRequest, HttpResponse, HttpStatusCode } from "@/application/helpers";

type HttpRequest = { file: { buffer: Buffer } };
type Model = Error;

class SaveProfilePicture {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError("foto"));
  }
}

describe("SaveProfilePicture Controller", () => {
  let sut: SaveProfilePicture;

  beforeEach(() => {
    sut = new SaveProfilePicture();
  });

  test("Should return 400 if file is not provided", async () => {
    const httpResponse = await sut.handle({ file: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });

  test("Should return 400 if file is not provided", async () => {
    const httpResponse = await sut.handle({ file: null as any });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });

  test("Should return 400 if file is empty", async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from("") } });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });
});
