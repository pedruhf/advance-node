import { getRepository } from "typeorm";

import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";

export class PgUserProfileRepo implements SaveUserPictureRepo, LoadUserProfile {
  async savePicture({ id, pictureUrl, initials }: SaveUserPictureRepo.Input): Promise<SaveUserPictureRepo.Output> {
    const pgUserRepo = getRepository(PgUser);
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
  }

  async load({ userId }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = getRepository(PgUser);
    const user = await pgUserRepo.findOne({ id: parseInt(userId) });
    if (!user) {
      return;
    }
    return { name: user.name };
  }
}
