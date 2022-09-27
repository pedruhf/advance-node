import { config, S3 } from "aws-sdk";

import { AwsS3FileStorage } from "@/infra/gateways";

jest.mock("aws-sdk");

describe("AwsS3FileStorage", () => {
  let sut: AwsS3FileStorage;
  let accessKeyId: string;
  let secretAccessKey: string;
  let fileName: string;
  let bucket: string;

  beforeAll(() => {
    accessKeyId = "any_access_key";
    secretAccessKey = "any_secret_key";
    fileName = "any_file_name";
    bucket = "any_bucket";
  });

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKeyId, secretAccessKey, bucket);
  });

  test("Should config aws credentials on creation", () => {
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    expect(config.update).toHaveBeenCalledTimes(1);
  });

  describe("upload", () => {
    let file: Buffer;
    let putObjectPromiseSpy: jest.Mock;
    let putObjectSpy: jest.Mock;

    beforeAll(() => {
      file = Buffer.from("any_buffer");
      putObjectPromiseSpy = jest.fn();
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }));
      jest.mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({
          putObject: putObjectSpy,
        }))
      );
    });

    test("Should call putObject with correct input", async () => {
      await sut.upload({ fileName, file });

      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName,
        Body: file,
        ACL: "public-read",
      });
      expect(putObjectSpy).toHaveBeenCalledTimes(1);
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    test("Should return imageUrl", async () => {
      const imageUrl = await sut.upload({ fileName, file });

      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/${fileName}`);
    });

    test("Should return encoded imageUrl", async () => {
      const imageUrl = await sut.upload({ fileName: "any file name", file });

      expect(imageUrl).toBe(`https://${bucket}.s3.amazonaws.com/any%20file%20name`);
    });

    test("Should rethrow if putObject throws", async () => {
      const error = new Error("upload_error");
      putObjectPromiseSpy.mockRejectedValueOnce(error);
      const promise = sut.upload({ fileName, file });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe("delete", () => {
    let deleteObjectPromiseSpy: jest.Mock;
    let deleteObjectSpy: jest.Mock;

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn();
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }));
      jest.mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({
          deleteObject: deleteObjectSpy,
        }))
      );
    });

    test("Should call deleteObject with correct input", async () => {
      await sut.delete({ fileName });

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: fileName,
      });
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    test("Should rethrow if putObject throws", async () => {
      const error = new Error("delete_error");
      deleteObjectPromiseSpy.mockRejectedValueOnce(error);
      const promise = sut.delete({ fileName });

      await expect(promise).rejects.toThrow(error);
    });
  });
});
