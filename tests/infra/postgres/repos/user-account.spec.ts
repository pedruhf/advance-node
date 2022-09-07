import { IBackup, IMemoryDb, newDb } from "pg-mem";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  getRepository,
  Repository,
  getConnection,
} from "typeorm";

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

type SutTypes = {
  sut: PgUserAccountRepo;
};

const makeSut = (): SutTypes => {
  const sut = new PgUserAccountRepo();

  return {
    sut,
  };
};

describe("PgUserAccountRepo", () => {
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: "postgres",
      entities: [PgUser],
    });
    await connection.synchronize();
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {});

  describe("load", () => {
    test("Should return an account if email exists", async () => {
      await pgUserRepo.save({
        email: "any_email",
      });

      const { sut } = makeSut();
      const account = await sut.load({ email: "any_email" });

      expect(account).toEqual({
        id: "1",
      });
    });

    test("Should return undefined if email doest not exists", async () => {
      const { sut } = makeSut();
      const account = await sut.load({ email: "any_email" });

      expect(account).toBeUndefined();
    });
  });
});
