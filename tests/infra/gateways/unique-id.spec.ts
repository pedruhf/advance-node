import { set, reset } from "mockdate";

import { UniqueId } from "@/infra/gateways";

describe("UniqueId", () => {
  let sut: UniqueId;

  beforeAll(() => {
    set(new Date(2021, 8, 21, 13, 35, 20));
  });

  afterAll(() => {
    reset();
  });

  beforeEach(() => {
    sut = new UniqueId();
  });

  test("Should create a unique id", () => {
    const uuid = sut.uuid({ key: "any_key" });

    expect(uuid).toBe("any_key_20210921133520");
  });
});
