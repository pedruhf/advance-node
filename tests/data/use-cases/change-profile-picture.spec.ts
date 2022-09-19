import { mock, MockProxy } from "jest-mock-extended";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;
type Input = { userId: string; file: Buffer };
type ChangeProfilePicture = (input: Input) => Promise<void>;

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
  return async ({ userId, file }) => {
    const uuid = crypto.uuid({ key: userId });
    await fileStorage.upload({ file, key: uuid });
  };
};

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>;
}

namespace UploadFile {
  export type Input = { file: Buffer; key: string };
}

interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output;
}

namespace UUIDGenerator {
  export type Input = { key: string };
  export type Output = string;
}

describe("ChangeProfilePicture UseCase", () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = "any_unique_id";
    file = Buffer.from("any_buffer");
    fileStorage = mock<UploadFile>();
    crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto);
  });

  test("Should call UploadFile with correct input", async () => {
    await sut({ userId: "any_user_id", file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
