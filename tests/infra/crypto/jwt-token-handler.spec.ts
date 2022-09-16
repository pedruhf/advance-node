import jwt from "jsonwebtoken";

import { JwtTokenHandler } from "@/infra/crypto";

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

  describe("generateToken", () => {
    const token = "any_token";
    const key = "any_key";
    const expirationInMs = 1000;

    test("Should call sign with correct params", async () => {
      const { sut } = makeSut();
      await sut.generateToken({ key, expirationInMs });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, "any_secret", { expiresIn: 1 });
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
    });

    test("Should return a token", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "sign").mockImplementationOnce(() => token);

      const generatedToken = await sut.generateToken({ key, expirationInMs });

      expect(generatedToken).toBe(token);
    });

    test("Should rethrow if sign throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "sign").mockImplementationOnce(() => {
        throw new Error("sign_error");
      });

      const tokenPromise = sut.generateToken({ key, expirationInMs });

      await expect(tokenPromise).rejects.toThrow(new Error("sign_error"));
    });
  });

  describe("validateToken", () => {
    const token = "any_token";
    const secret = "any_secret";
    const key = "any_key";

    test("Should call verify with correct params", async () => {
      const { sut } = makeSut();
      await sut.validateToken({ token });

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
    });

    test("Should return the key used to generate token", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "verify").mockImplementationOnce(() => key);
      const generatedKey = await sut.validateToken({ token });

      expect(generatedKey).toBe(key);
    });

    test("Should rethrow if verify throws", async () => {
      const { sut } = makeSut();
      jest.spyOn(fakeJwt, "verify").mockImplementationOnce(() => {
        throw new Error("verify_error");
      });

      const keyPromise = sut.validateToken({ token });

      await expect(keyPromise).rejects.toThrow(new Error("verify_error"));
    });
  });
});
