import { getRepository } from "typeorm";

import {
  LoadUserAccountByEmailRepo,
  SaveFacebookAccountRepo,
} from "@/data/repos";
import { PgUser } from "@/infra/postgres/entities";

export class PgUserAccountRepo implements LoadUserAccountByEmailRepo {
  private readonly pgUserRepo = getRepository(PgUser);

  async load(
    params: LoadUserAccountByEmailRepo.Params
  ): Promise<LoadUserAccountByEmailRepo.Result> {
    const pgUser = await this.pgUserRepo.findOne({ email: params.email });
    if (!pgUser) return;

    return {
      id: pgUser.id.toString(),
      ...(pgUser.name && { name: pgUser.name }),
    };
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepo.Params
  ): Promise<void> {
    if (!params.id) {
      await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });
      return;
    }

    await this.pgUserRepo.update(
      { id: parseInt(params.id) },
      {
        name: params.name,
        facebookId: params.facebookId,
      }
    );
  }
}
