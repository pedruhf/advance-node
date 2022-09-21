import { UniqueId } from "@/infra/crypto";

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
