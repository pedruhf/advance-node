import { RequiredFieldError } from "@/application/errors";
import { badRequest, HttpResponse, HttpStatusCode } from "@/application/helpers";

type HttpRequest = { file: any };
type Model = Error;

class SaveProfilePicture {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError("foto"));
  }
}

describe("SaveProfilePicture Controller", () => {
  test("Should return 400 if file is not provided", async () => {
    const sut = new SaveProfilePicture();
    const httpResponse = await sut.handle({ file: undefined });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.badRequest,
      data: new RequiredFieldError("foto"),
    });
  });
});
