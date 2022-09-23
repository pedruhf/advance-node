import { Controller } from "@/application/controllers";
import { HttpResponse, noContent } from "@/application/helpers";
import { ChangeProfilePicture } from "@/data/use-cases";

type HttpRequest = { userId: string };

export class DeleteProfilePicture extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ userId });
    return noContent();
  }
}
