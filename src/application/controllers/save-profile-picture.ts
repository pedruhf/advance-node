import { HttpResponse, success } from "@/application/helpers";
import { ChangeProfilePicture } from "@/data/use-cases";
import { Controller } from "@/application/controllers";
import { ValidationBuilder, Validator } from "@/application//validation";

type HttpRequest = { userId: string; file?: { buffer: Buffer; mimeType: string } };
type Model = { pictureUrl?: string; initials?: string };

export class SaveProfilePicture extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  override async perform({ userId, file }: HttpRequest): Promise<HttpResponse<Model>> {
    const { initials, pictureUrl } = await this.changeProfilePicture({ userId, file });
    return success({ initials, pictureUrl });
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    if (!file) return [];
    const validators = [
      ...ValidationBuilder.of({ value: file, fieldName: "foto" })
        .required()
        .image({ allowed: ["png", "jpg"], maxSizeInMB: 5})
        .build()
    ];
    return validators;
  }
}
