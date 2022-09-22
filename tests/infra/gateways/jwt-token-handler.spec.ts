import jwt from "jsonwebtoken";

import { JwtTokenHandler } from "@/infra/gateways";

jest.mock("jsonwebtoken");

type SutTypes = {
  sut: JwtTokenHandler;
};

const makeSut = (): SutTypes => {
  const sut = new JwtTokenHandler("any_secret");
  return {
    sut,
  };
};

describe("JwtTokenHandler", () => {
  let fakeJwt: jest.Mocked<typeof jwt>;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
  });

  describe("generate", () => {
    const token = "any_token";
    const key = "any_key";
    const expirationInMs = 1000;

    test("Should call sign with correct params", async () => {
      const { sut } = makeSut();
      await sut.generate({ key, expirationInMs });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, "any_secret", { expiresIn: 1 });
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
    });

    test("Should return a token", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "sign").mockImplementationOnce(() => token);

      const generatedToken = await sut.generate({ key, expirationInMs });

      expect(generatedToken).toBe(token);
    });

    test("Should rethrow if sign throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "sign").mockImplementationOnce(() => {
        throw new Error("sign_error");
      });

      const tokenPromise = sut.generate({ key, expirationInMs });

      await expect(tokenPromise).rejects.toThrow(new Error("sign_error"));
    });
  });

  describe("validate", () => {
    const token = "any_token";
    const secret = "any_secret";
    const key = "any_key";

    test("Should call verify with correct params", async () => {
      const { sut } = makeSut();
      await sut.validate({ token });

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
    });

    test("Should return the key used to generate token", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "verify").mockImplementationOnce(() => ({ key }));
      const generatedKey = await sut.validate({ token });

      expect(generatedKey).toBe(key);
    });

    test("Should rethrow if verify throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "verify").mockImplementationOnce(() => {
        throw new Error("verify_error");
      });

      const keyPromise = sut.validate({ token });

      await expect(keyPromise).rejects.toThrow(new Error("verify_error"));
    });
  });
});
