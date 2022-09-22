import { PgUserAccountRepo } from "@/infra/repos/postgres";

export const makePgUserAccountRepo = (): PgUserAccountRepo => {
  return new PgUserAccountRepo();
};
