import { InvalidMimeTypeError } from "@/application/errors";

export type Extension = "png" | "jpg";

export class AllowedMimeTypesValidator {
  constructor(private readonly allowed: Extension[], private readonly mimeType: string) {}

  validate(): Error | undefined {
    if (this.isPng()) return;
    if (this.isJpg()) return;
    return new InvalidMimeTypeError(this.allowed);
  }

  private isPng(): boolean {
    return this.allowed.includes("png") && this.mimeType === "image/png";
  }

  private isJpg(): boolean {
    return this.allowed.includes("jpg") && /image\/jpe?g/.test(this.mimeType);
  }
}
