import { AllowedMimeTypesValidator, Extension, MaxFileSizeValidator, RequiredBufferValidator, RequiredStringValidator, RequiredValidator, Validator } from "@/application/validation";

export class ValidationBuilder {
  private constructor(private readonly value: any, private readonly fieldName: string, private readonly validators: Validator[] = []) {}

  static of(params: { value: any; fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName);
  }

  public required(): ValidationBuilder {
    if (this.value instanceof Buffer) {
      this.validators.push(new RequiredBufferValidator(this.value, this.fieldName));
    } else if (typeof this.value === "string") {
      this.validators.push(new RequiredStringValidator(this.value, this.fieldName));
    } else if (typeof this.value === "object") {
      this.validators.push(new RequiredValidator(this.value, this.fieldName));
      if (this.value.buffer) {
        this.validators.push(new RequiredBufferValidator(this.value.buffer, this.fieldName));
      }
    }
    return this;
  }

  public image({ allowed, maxSizeInMB }: { allowed: Extension[], maxSizeInMB: number }): ValidationBuilder {
    if (this.value.mimeType) {
      this.validators.push(new AllowedMimeTypesValidator(allowed, this.value.mimeType));
    }
    if (this.value.buffer) {
      this.validators.push(new MaxFileSizeValidator(maxSizeInMB, this.value.buffer));
    }
    return this;
  }

  public build(): Validator[] {
    return this.validators;
  }
}
