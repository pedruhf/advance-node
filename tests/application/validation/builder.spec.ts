import { AllowedMimeTypesValidator, MaxFileSizeValidator, RequiredBufferValidator, RequiredStringValidator, RequiredValidator, ValidationBuilder } from "@/application/validation";

describe("ValidationBuilder", () => {
  test("Should return RequiredStringValidator", () => {
    const validators = ValidationBuilder.of({
      value: "any_value",
      fieldName: "any_name",
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredStringValidator("any_value", "any_name"),
    ]);
  });

  test("Should return RequiredBufferValidator", () => {
    const buffer = Buffer.from("any_buffer");
    const validators = ValidationBuilder.of({
      value: buffer,
      fieldName: "any_name",
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredBufferValidator(buffer, "any_name"),
    ]);
  });

  test("Should return RequiredValidator", () => {
    const object = { anyField: "any_value" };
    const validators = ValidationBuilder.of({
      value: object,
      fieldName: "any_name",
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredValidator(object, "any_name"),
    ]);
  });

  test("Should return RequiredValidator", () => {
    const buffer = Buffer.from("any_buffer");
    const validators = ValidationBuilder.of({
      value: { buffer },
      fieldName: "any_name",
    })
      .required()
      .build();

    expect(validators).toEqual([
      new RequiredValidator({ buffer }, "any_name"),
      new RequiredBufferValidator(buffer, "any_name"),
    ]);
  });

  test("Should return correct image validators", () => {
    const buffer = Buffer.from("any_buffer");
    const validators = ValidationBuilder.of({
      value: { buffer },
      fieldName: "any_name",
    })
      .image({ allowed: ["png"], maxSizeInMB: 5 })
      .build();

    expect(validators).toEqual([
      new MaxFileSizeValidator(5, buffer),
    ]);
  });

  test("Should return correct image validators", () => {
    const validators = ValidationBuilder.of({
      value: { mimeType: "image/png" },
      fieldName: "any_name",
    })
      .image({ allowed: ["png"], maxSizeInMB: 5 })
      .build();

    expect(validators).toEqual([
      new AllowedMimeTypesValidator(["png"], "image/png"),
    ]);
  });

  test("Should return correct image validators", () => {
    const buffer = Buffer.from("any_buffer");
    const validators = ValidationBuilder.of({
      value: { buffer, mimeType: "image/png" },
      fieldName: "any_name",
    })
      .image({ allowed: ["png"], maxSizeInMB: 5 })
      .build();

    expect(validators).toEqual([
      new AllowedMimeTypesValidator(["png"], "image/png"),
      new MaxFileSizeValidator(5, buffer),
    ]);
  });
});
