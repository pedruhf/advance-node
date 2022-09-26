import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from "@/application/errors";
import { badRequest, HttpResponse, success } from "@/application/helpers";
import { ChangeProfilePicture } from "@/data/use-cases";
import { Controller } from "@/application/controllers";
import { AllowedMimeTypesValidator, MaxFileSizeValidator, RequiredBufferValidator, RequiredValidator, Validator } from "@/application//validation";

type HttpRequest = { userId: string; file: { buffer: Buffer; mimeType: string } };
type Model = { pictureUrl?: string; initials?: string } | Error;

export class SaveProfilePicture extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  override async perform({ userId, file }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!file) {
      return badRequest(new RequiredFieldError("foto"));
    }
    if (file.buffer.length === 0) {
      return badRequest(new RequiredFieldError("foto"));
    }
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(["png", "jpg", "jpeg"]));
    }
    if (file.buffer.length > 5 * 1024 * 1024) {
      return badRequest(new MaxFileSizeError(5));
    }
    const data = await this.changeProfilePicture({ userId, file: file.buffer });
    return success(data);
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    const validators = [
      new RequiredValidator(file, "file"),
      new RequiredBufferValidator(file.buffer, "buffer"),
      new AllowedMimeTypesValidator(["png", "jpg"], file.mimeType),
      new MaxFileSizeValidator(5, file.buffer),
    ];
    return validators;
  }
}
