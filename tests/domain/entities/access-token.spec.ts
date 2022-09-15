import { AccessToken } from "@/domain/entities";

describe("AccessToken", () => {
  test("Should create with a value", () => {
    const sut = new AccessToken("any_value");
    expect(sut).toEqual({
      value: "any_value",
    });
  });

  test("Should expire 30 * 60 * 1000 ms", () => {
    expect(AccessToken.expirationInMs).toBe(30 * 60 * 1000); // 30 minutes
  });
});
