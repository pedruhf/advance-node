import { IBackup } from "pg-mem";
import { Repository } from "typeorm";

import { PgUserProfileRepo } from "@/infra/repos/postgres";
import { PgUser } from "@/infra/repos/postgres/entities";
import { makeFakeDb } from "@/tests/infra/mocks";
import { PgRepo } from "@/infra/repos/postgres/repository";
import { PgConnection } from "@/infra/repos/postgres/helpers";

type SutTypes = {
  sut: PgUserProfileRepo;
};

const makeSut = (): SutTypes => {
  const sut = new PgUserProfileRepo();

  return {
    sut,
  };
};

describe("PgUserProfileRepo", () => {
  let connection: PgConnection;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    connection = PgConnection.getInstance();
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = connection.getRepository(PgUser);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  beforeEach(() => {
    backup.restore();
  });

  test("Should extend PgRepositoty", () => {
    const { sut } = makeSut();
    expect(sut).toBeInstanceOf(PgRepo);
  });

  describe("savePicture", () => {
    test("Should update user profile", async () => {
      const { sut } = makeSut();
      const { id } = await pgUserRepo.save({ email: "any_email", initials: "any_initials" });
      await sut.savePicture({ id: id.toString(), pictureUrl: "any_url" });

      const user = (await pgUserRepo.findOne(id)) as PgUser;
      expect(user).toMatchObject({
        id,
        email: "any_email",
        pictureUrl: "any_url",
        initials: null,
      });
    });
  });

  describe("load", () => {
    test("Should load user profile", async () => {
      const { sut } = makeSut();
      const { id } = await pgUserRepo.save({ email: "any_email", name: "any_name" });
      const user = await sut.load({ userId: id.toString() });

      expect(user?.name).toBe("any_name");
    });

    test("Should load user profile", async () => {
      const { sut } = makeSut();
      const { id } = await pgUserRepo.save({ email: "any_email" });
      const user = await sut.load({ userId: id.toString() });

      expect(user?.name).toBeUndefined();
    });

    test("Should return undefined ", async () => {
      const { sut } = makeSut();
      const user = await sut.load({ userId: "1" });

      expect(user).toBeUndefined();
    });
  });
});
