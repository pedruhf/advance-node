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
  token: string;
};

type Model = { accessToken: string } | Error;

export class FacebookLoginController {
  constructor(
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest);
      if (error) {
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

  private validate(httpRequest: HttpRequest): Error | undefined {
    if (!httpRequest.token) {
      return new RequiredFieldError("token");
    }
  }
}
