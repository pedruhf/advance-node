import { getMockReq, getMockRes } from "@jest-mock/express";
import { RequestHandler } from "express";
import multer from "multer";

jest.mock("multer");

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single("any_file_name");
  upload(req, res, () => {});
};

describe("Multer Adapter", () => {
  test("Should call single upload with correct input", async () => {
    const uploadSpy = jest.fn();
    const singleSpy = jest.fn().mockImplementationOnce(() => uploadSpy);
    const multerSpy = jest.fn().mockImplementationOnce(() => ({
      single: singleSpy,
    }));
    const fakeMulter = multer as jest.Mocked<typeof multer>;
    jest.mocked(fakeMulter).mockImplementationOnce(multerSpy);
    const req = getMockReq();
    const res = getMockRes().res;
    const next = getMockRes().next;
    const sut = adaptMulter;
    sut(req, res, next);

    expect(multerSpy).toHaveBeenCalledWith();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith("any_file_name");
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });
});
