import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import {
  badRequest,
  HttpResponse,
  serverError,
  success,
  unauthorized,
} from "@/application/helpers";
import { RequiredFieldError } from "@/application/errors";

type HttpRequest = {
  token: string | undefined | null;
};

type Model = { accessToken: string } | Error;

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError("token"));
      }

      const accessToken = await this.facebookAuthentication.perform({
        token: httpRequest.token,
      });
      if (accessToken instanceof AccessToken) {
        return success({
          accessToken: accessToken.value,
        });
      }

      return unauthorized();
    } catch (error) {
      return serverError(<Error>error);
    }
  }
}
