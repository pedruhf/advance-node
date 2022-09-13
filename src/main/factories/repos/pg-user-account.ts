import { PgUserAccountRepo } from "@/infra/postgres/repos";

export const makePgUserAccountRepo = (): PgUserAccountRepo => {
  return new PgUserAccountRepo();
};
