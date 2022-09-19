import { mock } from "jest-mock-extended";

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
  test("Should call UploadFile with correct input", async () => {
    const uuid = "any_unique_id";
    const file = Buffer.from("any_buffer");
    const fileStorage = mock<UploadFile>();
    const crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
    const sut = setupChangeProfilePicture(fileStorage, crypto);
    await sut({ userId: "any_user_id", file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
