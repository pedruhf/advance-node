import { getRepository } from "typeorm";

import { SaveUserPictureRepo } from "@/data/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";

export class PgUserProfileRepo implements SaveUserPictureRepo {
  async savePicture ({ id, pictureUrl, initials }: SaveUserPictureRepo.Input): Promise<SaveUserPictureRepo.Output> {
    const pgUserRepo = getRepository(PgUser);
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
  }
}
