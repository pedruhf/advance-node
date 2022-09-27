import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";

jest.mock("multer");

const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer().single("any_file_name");
  upload(req, res, () => {});
};

describe("Multer Adapter", () => {
  let uploadSpy: jest.Mock;
  let singleSpy: jest.Mock;
  let multerSpy: jest.Mock;
  let fakeMulter: jest.Mocked<typeof multer>;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sut: RequestHandler;

  beforeAll(() => {
    uploadSpy = jest.fn();
    singleSpy = jest.fn().mockImplementationOnce(() => uploadSpy);
    multerSpy = jest.fn().mockImplementationOnce(() => ({
      single: singleSpy,
    }));
    fakeMulter = multer as jest.Mocked<typeof multer>;
    jest.mocked(fakeMulter).mockImplementationOnce(multerSpy);
    req = getMockReq();
    res = getMockRes().res;
    next = getMockRes().next;
  });

  beforeEach(() => {
    sut = adaptMulter;
  });

  test("Should call single upload with correct input", async () => {
    sut(req, res, next);

    expect(multerSpy).toHaveBeenCalledWith();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith("any_file_name");
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });
});
