import { Controller } from "@/application/controllers";
import { HttpResponse, HttpStatusCode, noContent } from "@/application/helpers";
import { ChangeProfilePicture } from "@/data/use-cases";

type HttpRequest = { userId: string };
class DeleteProfilePicture extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ userId });
    return noContent();
  }
}

describe("DeleteProfilePicture Controller", () => {
  let changeProfilePicture: jest.Mock;
  let sut: DeleteProfilePicture;

  beforeAll(() => {
    changeProfilePicture = jest.fn();
  });

  beforeEach(() => {
    sut = new DeleteProfilePicture(changeProfilePicture);
  });

  test("Shoul extend Cpntroller", async () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  test("Shoul call ChangeProfilePicture with correct input", async () => {
    await sut.handle({ userId: "any_user_id" });

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: "any_user_id" });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  test("Shoul return 204", async () => {
    const httpResponse = await sut.handle({ userId: "any_user_id" });

    expect(httpResponse).toEqual({
      statusCode: HttpStatusCode.noContent,
      data: null,
    });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });
});
