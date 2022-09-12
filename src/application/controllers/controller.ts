import { badRequest, HttpResponse, serverError } from "@/application/helpers";
import { ValidationComposite, Validator } from "@/application/validation";

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>;

  public buildValidators(httpRequest: any): Validator[] {
    return [];
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error) {
      return badRequest(error);
    }

    try {
      const result = await this.perform(httpRequest);
      return result;
    } catch (error) {
      return serverError(<Error>error);
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    const validator = new ValidationComposite(validators);
    return validator.validate();
  }
}
