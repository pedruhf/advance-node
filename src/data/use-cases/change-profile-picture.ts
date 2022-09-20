import { UploadFile, UUIDGenerator } from "@/data/contracts/gateways";
import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";

type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveUserPictureRepo & LoadUserProfile
) => ChangeProfilePicture;
type Input = { userId: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ userId, file }) => {
    if (!file) {
      await userProfileRepo.savePicture({ pictureUrl: undefined });
      await userProfileRepo.load({ userId });
      return;
    }
    const key = crypto.uuid({ key: userId });
    const pictureUrl = await fileStorage.upload({ file, key });
    await userProfileRepo.savePicture({ pictureUrl });
  };
};
