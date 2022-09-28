import { LoadUserProfile, SaveUserPictureRepo } from "@/data/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";
import { PgRepo } from "@/infra/repos/postgres";

export class PgUserProfileRepo extends PgRepo implements SaveUserPictureRepo, LoadUserProfile {
  async savePicture({ id, pictureUrl, initials }: SaveUserPictureRepo.Input): Promise<SaveUserPictureRepo.Output> {
    const pgUserRepo = this.getRepository(PgUser);
    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials });
  }

  async load({ userId }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = this.getRepository(PgUser);
    const user = await pgUserRepo.findOne({ id: parseInt(userId) });

    if (!user) {
      return;
    }
    return { name: user.name ?? undefined };
  }
}
