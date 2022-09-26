import { MaxFileSizeError } from "../errors";

export class MaxFileSizeValidator {
  constructor(private readonly maxSizeInMB: number, private readonly value: Buffer) {}

  validate(): Error | undefined {
    const maxFileSizeInBytes = 5 * 1024 * 1024;
    if (this.value.length > maxFileSizeInBytes) {
      return new MaxFileSizeError(this.maxSizeInMB);
    }
  }
}