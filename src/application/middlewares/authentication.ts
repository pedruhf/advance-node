import { forbidden, HttpResponse, success } from "@/application/helpers";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/data/contracts/middlewares";

type HttpRequest = {
  authorization: string;
};

type Model = { userId: string } | Error;

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!this.validate({ authorization })) {
      return forbidden();
    }
    try {
      const userId = await this.authorize.perform({ token: authorization });
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
