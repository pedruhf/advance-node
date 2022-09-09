import { Validator } from "@/application/validation";

export class ValidatorSpy implements Validator {
  validate(): Error | undefined {
    return undefined;
  }
}
