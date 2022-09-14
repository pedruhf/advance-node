import { getRepository } from "typeorm";

import { LoadUserAccountByEmailRepo, SaveFacebookAccountRepo } from "@/data/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepo implements LoadUserAccountByEmailRepo, SaveFacebookAccountRepo {
  private readonly pgUserRepo = getRepository(PgUser);

  async load({ email }: LoadUserAccountByEmailRepo.Params): Promise<LoadUserAccountByEmailRepo.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: email });
    if (!pgUser) return;

    return {
      id: pgUser.id.toString(),
      name: pgUser.name ?? undefined,
    };
  }

  async saveWithFacebook({ id, name, email, facebookId }: SaveFacebookAccountRepo.Params): Promise<SaveFacebookAccountRepo.Result> {
    if (!id) {
      const pgUser = await this.pgUserRepo.save({
        email,
        name,
        facebookId,
      });

      return { id: pgUser.id.toString() };
    }

    await this.pgUserRepo.update({ id: parseInt(id) }, { name, facebookId });

    return { id };
  }
}
