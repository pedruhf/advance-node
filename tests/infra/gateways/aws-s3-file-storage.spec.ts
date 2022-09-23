import { config } from "aws-sdk";

jest.mock("aws-sdk");

class AwsS3FileStorage {
  constructor(private readonly accessKeyId: string, private readonly secretAccessKey: string) {
    config.update({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }
}

describe("AwsS3FileStorage", () => {
  test("Should config aws credentials on creation", () => {
    const accessKeyId = "any_access_key";
    const secretAccessKey = "any_secret_key";
    const sut = new AwsS3FileStorage(accessKeyId, secretAccessKey);

    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    expect(config.update).toHaveBeenCalledTimes(1);
  });
});
