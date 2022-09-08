type HttpResponse = { statusCode: number; data: any };

class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error("The field token is required"),
    };
  }
}

describe("FacebookLoginController", () => {
  test("Should return 400 if token is empty", async () => {
    const sut = new FacebookLoginController();
    const httpResponse = await sut.handle({ token: "" });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error("The field token is required"),
    });
  });
});
