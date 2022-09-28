import { ChangeProfilePicture, setupChangeProfilePicture } from "@/data/use-cases";
import { makeAwsS3FileStorage, makeUniqueId } from "@/main/factories/infra/gateways";
import { makePgUserProfileRepo } from "@/main/factories/infra/repos/postgres";

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeAwsS3FileStorage(),
    makeUniqueId(),
    makePgUserProfileRepo(),
  );
};
