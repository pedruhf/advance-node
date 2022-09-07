import { newDb } from "pg-mem";
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from "typeorm";

import { LoadUserAccountByEmailRepo } from "@/data/repos";

class PgUserAccountRepo implements LoadUserAccountByEmailRepo {
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
}

@Entity({ name: "usuarios" })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nome", nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: "id_facebook", nullable: true })
  facebookId?: string;
}

describe("PgUserAccountRepo", () => {
  describe("load", () => {
    test("Should return an account if email exists", async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: "postgres",
        entities: [PgUser],
      });
      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({
        email: "existing_email",
      });

      const sut = new PgUserAccountRepo();
      const account = await sut.load({ email: "existing_email" });

      expect(account).toEqual({
        id: "1",
      });
      await connection.close();
    });

    test("Should return undefined if email doest not exists", async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: "postgres",
        entities: [PgUser],
      });
      await connection.synchronize();

      const sut = new PgUserAccountRepo();
      const account = await sut.load({ email: "new_email" });

      expect(account).toBeUndefined();
      await connection.close();
    });
  });
});
