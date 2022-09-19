import { mock, MockProxy } from "jest-mock-extended";

import { UploadFile, UUIDGenerator } from "@/data/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/data/use-cases";
import { SaveUserPictureRepo } from "@/data/contracts/repos";

describe("ChangeProfilePicture UseCase", () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<SaveUserPictureRepo>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = "any_unique_id";
    file = Buffer.from("any_buffer");
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue("any_url");
    crypto = mock();
    userProfileRepo = mock();
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
  });

  test("Should call UploadFile with correct input", async () => {
    await sut({ userId: "any_user_id", file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  test("Should not call UploadFile when file is undefined", async () => {
    await sut({ userId: "any_user_id", file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  test("Should call SaveUserPictureRepo with correct input", async () => {
    await sut({ userId: "any_user_id", file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: "any_url" });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });
});
