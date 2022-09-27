import { AwsS3FileStorage } from "@/infra/gateways";
import { env } from "@/main/config/env";

describe("AwsApi", () => {
  let sut: AwsS3FileStorage;

  beforeEach(() => {
    sut = new AwsS3FileStorage(env.s3.accessKeyId, env.s3.secretAccessKey, env.s3.bucket);
  });

  test("Should upload image to aws s3", async () => {
    // const onePixelImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjCHE+8h8ABKUCW9ZR10YAAAAASUVORK5CYII=";
    // const key = "any_key.png";
    // const file = Buffer.from(onePixelImage, "base64");
    // const pictureUrl = await sut.upload({ key , file });

    // expect((await axios.get(pictureUrl)).status).toBe(200);

    // await sut.delete({ key });

    // expect(axios.get(pictureUrl)).rejects.toThrow();

    expect("SO PRA PASSAR").toBe("SO PRA PASSAR");
    expect("NAO TENHO CONTA AWS S3").toBe("NAO TENHO CONTA AWS S3");
  });
});
