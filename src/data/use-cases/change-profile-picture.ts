import { UploadFile, UUIDGenerator } from "@/data/contracts/gateways";

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;
type Input = { userId: string; file: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
  return async ({ userId, file }) => {
    const uuid = crypto.uuid({ key: userId });
    await fileStorage.upload({ file, key: uuid });
  };
};
