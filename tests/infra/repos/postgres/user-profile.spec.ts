import { IBackup } from "pg-mem";
import { getRepository, Repository, getConnection } from "typeorm";

import { PgUserProfileRepo } from "@/infra/repos/postgres";
import { PgUser } from "@/infra/repos/postgres/entities";
import { makeFakeDb } from "@/tests/infra/mocks";

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
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
  });

  describe("savePicture", () => {
    test("Should update user profile", async () => {
      const { sut } = makeSut();
      const { id } = await pgUserRepo.save({ email: "any_email", initials: "any_initials" });
      await sut.savePicture({ id: id.toString(), pictureUrl: "any_url" });

      const user = await pgUserRepo.findOne(id) as PgUser;
      expect(user).toMatchObject({
        id,
        email: "any_email",
        pictureUrl: "any_url",
        initials: null,
      });
    });
  });
});
