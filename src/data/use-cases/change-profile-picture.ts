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
      const { name } = await userProfileRepo.load({ userId });
      let initials: string | undefined;
      if (name) {
        const firstLetters = name?.match(/\b(.)/g) ?? [];
        if (firstLetters.length > 1) {
          initials = `${firstLetters.shift()?.toUpperCase() ?? ""}${firstLetters.pop()?.toUpperCase() ?? ""}`;
        } else {
          initials = name.substring(0, 2).toUpperCase();
        }
      }
      await userProfileRepo.savePicture({ pictureUrl: undefined, initials });
      return;
    }
    const key = crypto.uuid({ key: userId });
    const pictureUrl = await fileStorage.upload({ file, key });
    await userProfileRepo.savePicture({ pictureUrl });
  };
};
