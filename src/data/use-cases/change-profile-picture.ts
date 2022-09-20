import { UploadFile, UUIDGenerator } from "@/data/contracts/gateways";
import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";
import { UserProfile } from "@/domain/entities";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPictureRepo & LoadUserProfile) => ChangeProfilePicture;
type Input = { userId: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ userId, file }) => {
    let pictureUrl: string | undefined;
    let name: string | undefined;

    if (file) {
      const key = crypto.uuid({ key: userId });
      pictureUrl = await fileStorage.upload({ file, key });
    } else {
      name = (await userProfileRepo.load({ userId })).name;
    }
    const userProfile = new UserProfile(userId);
    userProfile.setPicture({ pictureUrl, name });
    await userProfileRepo.savePicture(userProfile);
  };
};
