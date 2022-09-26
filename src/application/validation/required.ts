import { RequiredFieldError } from "@/application/errors";

export class RequiredValidator {
  constructor(protected readonly value: any, protected readonly fieldName: string) {}

  validate(): Error | undefined {
    if (!this.value) {
      return new RequiredFieldError(this.fieldName);
    }
  }
}

export class RequiredStringValidator extends RequiredValidator {
  constructor(override readonly value: string, override readonly fieldName: string) {
    super(value, fieldName);
  }

  override validate(): Error | undefined {
    if (super.validate() instanceof Error || this.value === "") {
      return new RequiredFieldError(this.fieldName);
    }
  }
}
