import { IBackup } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";

import { PgUserAccountRepo } from "@/infra/postgres/repos";
import { PgUser } from "@/infra/postgres/entities";
import { makeFakeDb } from "@/tests/infra/mocks";

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

  describe("saveWithFacebook", () => {
    test("Should create an account if id is undefined", async () => {
      const { sut } = makeSut();
      await sut.saveWithFacebook({
        email: "any_email",
        name: "any_name",
        facebookId: "any_facebook_id",
      });

      const account = await pgUserRepo.findOne({ email: "any_email" });

      expect(account?.id).toBe(1);
    });

    test("Should update account if id exists", async () => {
      await pgUserRepo.save({
        email: "any_email",
        name: "any_name",
        facebookId: "any_facebook_id",
      });

      const { sut } = makeSut();
      await sut.saveWithFacebook({
        id: "1",
        email: "new_email",
        name: "new_name",
        facebookId: "new_facebook_id",
      });

      const account = await pgUserRepo.findOne({ id: 1 });

      expect(account).toEqual({
        id: 1,
        email: "any_email",
        name: "new_name",
        facebookId: "new_facebook_id",
      });
    });
  });
});
