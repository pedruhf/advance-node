import { getRepository } from "typeorm";

import { LoadUserAccountByEmailRepo, SaveFacebookAccountRepo } from "@/data/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepo implements LoadUserAccountByEmailRepo {
  async load(
    params: LoadUserAccountByEmailRepo.Params
  ): Promise<LoadUserAccountByEmailRepo.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } });
    if (!pgUser) return;

    return {
      id: pgUser.id.toString(),
      ...(pgUser.name && { name: pgUser.name }),
    };
  }

  async saveWithFacebook(params: SaveFacebookAccountRepo.Params): Promise<void> {
    const pgUserRepo = getRepository(PgUser);
    if (!params.id) {
      await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      return;
    }

    await pgUserRepo.update({ id: parseInt(params.id) }, {
      name: params.name,
      facebookId: params.facebookId,
    });
  }
}
