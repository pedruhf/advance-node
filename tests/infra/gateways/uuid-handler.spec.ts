import { v4 } from "uuid";

import { UUIDHandler } from "@/infra/gateways";

jest.mock("uuid");

describe("UUID Handler", () => {
  let sut: UUIDHandler;

  beforeEach(() => {
    sut = new UUIDHandler();
  });

  test("Should call uuid.v4", () => {
    sut.uuid({ key: "any_key" });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  test("Should return correct value", () => {
    jest.mocked(v4).mockReturnValueOnce("any_uuid");

    const uuid = sut.uuid({ key: "any_key" });

    expect(uuid).toBe("any_key_any_uuid");
  });
});
