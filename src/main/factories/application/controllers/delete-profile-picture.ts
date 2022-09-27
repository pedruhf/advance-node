import { DeleteProfilePicture } from "@/application/controllers";
import { makeChangeProfilePicture } from "../../data/use-cases";

export const makeDeleteProfilePictureController = (): DeleteProfilePicture => {
  return new DeleteProfilePicture(makeChangeProfilePicture());
};
