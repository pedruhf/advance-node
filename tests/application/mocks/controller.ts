import { Controller } from "@/application/controllers";
import { HttpResponse } from "@/application/helpers";

export class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: "any_data",
  };

  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.result;
  }
}
