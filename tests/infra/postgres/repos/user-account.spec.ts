import { IBackup, IMemoryDb, newDb } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";

import { PgUserAccountRepo } from "@/infra/postgres/repos";
import { PgUser } from "@/infra/postgres/entities";

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: "postgres",
    entities: entities ?? ["src/infra/postgres/entities/index.ts"],
  });
  await connection.synchronize();

  return db;
};

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
    const db = await makeFakeDb([PgUser]);
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
