import { IBackup } from "pg-mem";
import { Repository } from "typeorm";

import { PgUserAccountRepo } from "@/infra/repos/postgres";
import { PgUser } from "@/infra/repos/postgres/entities";
import { makeFakeDb } from "@/tests/infra/mocks";
import { PgRepo } from "@/infra/repos/postgres/repository";
import { PgConnection } from "@/infra/repos/postgres/helpers";

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
  let connection: PgConnection;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    connection = PgConnection.getInstance();
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = connection.getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  test("Should extend PgRepositoty", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(PgRepo);
  });

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
      const { id } = await sut.saveWithFacebook({
        email: "any_email",
        name: "any_name",
        facebookId: "any_facebook_id",
      });

      const pgAccount = await pgUserRepo.findOne({ email: "any_email" });

      expect(id).toBe("1");
      expect(pgAccount?.id).toBe(1);
    });

    test("Should update account if id exists", async () => {
      await pgUserRepo.save({
        email: "any_email",
        name: "any_name",
        facebookId: "any_facebook_id",
      });

      const { sut } = makeSut();
      const { id } = await sut.saveWithFacebook({
        id: "1",
        email: "new_email",
        name: "new_name",
        facebookId: "new_facebook_id",
      });

      const account = await pgUserRepo.findOne({ id: 1 });

      expect(account).toMatchObject({
        id: 1,
        email: "any_email",
        name: "new_name",
        facebookId: "new_facebook_id",
      });
      expect(id).toBe("1");
    });
  });
});
