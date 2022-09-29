import { Controller } from "@/application/controllers";
import { SaveProfilePicture } from "@/application/controllers/save-profile-picture";
import { makeChangeProfilePicture } from "@/main/factories/data/use-cases";
import { makePgTransactionController } from "../decorators";

export const makeSaveProfilePictureController = (): Controller => {
  const decoratee = new SaveProfilePicture(makeChangeProfilePicture());
  return makePgTransactionController(decoratee);
};
