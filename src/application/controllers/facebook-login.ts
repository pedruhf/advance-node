import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/models";
import { HttpResponse, success, unauthorized } from "@/application/helpers";
import { ValidationBuilder, Validator } from "@/application/validation";
import { Controller } from "@/application/controllers";

type HttpRequest = {
  token: string;
};

type Model = { accessToken: string } | Error;

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({
      token,
    });
    if (accessToken instanceof AccessToken) {
      return success({
        accessToken: accessToken.value,
      });
    }

    return unauthorized();
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    const validators = [
      ...ValidationBuilder.of({ value: token, fieldName: "token" }).required().build()
    ];
    return validators;
  }
}
