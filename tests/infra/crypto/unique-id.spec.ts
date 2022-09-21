
import { UUIDGenerator } from "@/data/contracts/gateways";
import { UUIDHandler } from "@/infra/crypto";

class UniqueId implements UUIDHandler {
  constructor (private readonly date: Date) {}

  uuid({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return key +
      "_" +
      this.date.getFullYear().toString() +
      (this.date.getMonth() + 1).toString().padStart(2, "0") +
      this.date.getDate().toString().padStart(2, "0") +
      this.date.getHours().toString().padStart(2, "0") +
      this.date.getMinutes().toString().padStart(2, "0") +
      this.date.getSeconds().toString().padStart(2, "0");
  }
}

describe("UniqueId", () => {
  test("Should returns correct uuid", () => {
    const sut = new UniqueId(new Date(2021, 8, 21, 13, 35, 20));
    const uuid = sut.uuid({ key: "any_key" });

    expect(uuid).toBe("any_key_20210921133520");
  });

  test("Should returns correct uuid", () => {
    const sut = new UniqueId(new Date(2019, 1, 1, 1, 1, 1));
    const uuid = sut.uuid({ key: "any_key" });

    expect(uuid).toBe("any_key_20190201010101");
  });
});
