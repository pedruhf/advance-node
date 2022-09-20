import { mock, MockProxy } from "jest-mock-extended";

import { UploadFile, UUIDGenerator } from "@/data/contracts/gateways";
import { ChangeProfilePicture, setupChangeProfilePicture } from "@/data/use-cases";
import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";
import { UserProfile } from "@/domain/entities";

jest.mock("@/domain/entities/user-profile");

describe("ChangeProfilePicture UseCase", () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<SaveUserPictureRepo & LoadUserProfile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = "any_unique_id";
    file = Buffer.from("any_buffer");
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue("any_url");
    crypto = mock();
    userProfileRepo = mock();
    userProfileRepo.load.mockResolvedValue({ name: "Pedro Henrique de Freitas Silva" });
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(jest.mocked(UserProfile).mock.instances[0]);
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  test("Should call LoadUserProfile with correct input", async () => {
    await sut({ userId: "any_user_id", file: undefined });

    expect(userProfileRepo.load).toHaveBeenCalledWith({ userId: "any_user_id" });
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
  });

  test("Should not call LoadUserProfile if file exists", async () => {
    await sut({ userId: "any_user_id", file });

    expect(userProfileRepo.load).not.toHaveBeenCalled();
  });

  test("Should return correct data on success", async () => {
    jest.mocked(UserProfile).mockImplementationOnce(() => ({
      setPicture: jest.fn(),
      id: "any_id",
      pictureUrl: "any_url",
      initials: "any_initials",
    }));
    const result = await sut({ userId: "any_user_id", file });

    expect(result).toMatchObject({
      pictureUrl: "any_url",
      initials: "any_initials",
    });
  });
});
