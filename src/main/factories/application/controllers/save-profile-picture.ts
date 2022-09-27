import { SaveProfilePicture } from "@/application/controllers/save-profile-picture";
import { makeChangeProfilePicture } from "../../data/use-cases";

export const makeSaveProfilePictureController = (): SaveProfilePicture => {
  return new SaveProfilePicture(makeChangeProfilePicture());
};
