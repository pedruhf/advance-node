import { DeleteFile, UploadFile, UUIDGenerator } from "@/data/contracts/gateways";
import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";
import { UserProfile } from "@/domain/entities";

type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveUserPictureRepo & LoadUserProfile
) => ChangeProfilePicture;
type Input = { userId: string; file?: Buffer };
type Output = { pictureUrl?: string; initials?: string };
export type ChangeProfilePicture = (input: Input) => Promise<Output>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ userId, file }) => {
    const key = crypto.uuid({ key: userId });
    const data = {
      pictureUrl: file ? await fileStorage.upload({ file, key }) : undefined,
      name: !file ? (await userProfileRepo.load({ userId })).name : undefined,
    };
    const userProfile = new UserProfile(userId);
    userProfile.setPicture(data);
    try {
      await userProfileRepo.savePicture(userProfile);
    } catch (error) {
      if (file) {
        await fileStorage.delete({ key });
      }
      throw error;
    }
    return userProfile;
  };
};
