import { forbidden, HttpResponse, success } from "@/application/helpers";
import { RequiredStringValidator } from "@/application/validation";
import { Middleware } from "@/application//middlewares";

type HttpRequest = {
  authorization: string;
};

type Model = { userId: string } | Error;

type Authorize = (input: { token: string }) => Promise<string>;

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) {
      return forbidden();
    }
    try {
      const userId = await this.authorize({ token: authorization });
      return success({ userId });
    } catch {
      return forbidden();
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, "authorization").validate();
    return error ? false : true;
  }
}
