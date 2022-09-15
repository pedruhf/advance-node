import { AccessToken } from "@/domain/entities";

describe("AccessToken", () => {
  test("Should expire 30 * 60 * 1000 ms", () => {
    expect(AccessToken.expirationInMs).toBe(30 * 60 * 1000); // 30 minutes
  });
});
