import { v4 } from "uuid";

import { UUIDGenerator } from "@/data/contracts/gateways";

jest.mock("uuid");

class UUIDHandler implements UUIDGenerator {
  uuid ({ key }: UUIDGenerator.Input): string {
    v4();
    return "";
  }
}

describe("UUID Handler", () => {
  test("Should call uuid.v4", () => {
    const sut = new UUIDHandler();
    sut.uuid({ key: "any_key "});

    expect(v4).toHaveBeenCalledTimes(1);
  });
});
