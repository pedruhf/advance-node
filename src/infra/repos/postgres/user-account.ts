import { LoadUserAccountByEmailRepo, SaveFacebookAccountRepo } from "@/data/contracts/repos";
import { PgUser } from "@/infra/repos/postgres/entities";
import { PgRepo } from "@/infra/repos/postgres";

export class PgUserAccountRepo extends PgRepo implements LoadUserAccountByEmailRepo, SaveFacebookAccountRepo {
  async load({ email }: LoadUserAccountByEmailRepo.Params): Promise<LoadUserAccountByEmailRepo.Result> {
    const pgUserRepo = this.getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email: email });
    if (!pgUser) return;

    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }

  async saveWithFacebook({ id, name, email, facebookId }: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    const pgUserRepo = this.getRepository(PgUser);
    if (!id) {
      const pgUser = await pgUserRepo.save({
        email,
        name,
        facebookId,
      });

      return { id: pgUser.id.toString() };
    }

    await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId });

    return { id };
  }
}
