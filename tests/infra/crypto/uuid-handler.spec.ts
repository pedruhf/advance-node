import { v4 } from "uuid";

import { UUIDGenerator } from "@/data/contracts/gateways";

jest.mock("uuid");

class UUIDHandler implements UUIDGenerator {
  uuid({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const uuid = v4();
    return `${key}_${uuid}`;
  }
}

describe("UUID Handler", () => {
  test("Should call uuid.v4", () => {
    const sut = new UUIDHandler();
    sut.uuid({ key: "any_key " });

    expect(v4).toHaveBeenCalledTimes(1);
  });

  test("Should return correct value", () => {
    jest.mocked(v4).mockReturnValueOnce("any_uuid");

    const sut = new UUIDHandler();
    const uuid = sut.uuid({ key: "any_key" });

    expect(uuid).toBe("any_key_any_uuid");
  });
});
