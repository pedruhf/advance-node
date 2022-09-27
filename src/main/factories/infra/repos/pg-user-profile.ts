import { PgUserProfileRepo } from "@/infra/repos/postgres";

export const makePgUserProfileRepo = (): PgUserProfileRepo => {
  return new PgUserProfileRepo();
};
