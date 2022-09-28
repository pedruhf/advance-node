import { FacebookAuthenticationUseCase } from "@/data/use-cases";
import { makeFacebookApi } from "@/main/factories/infra/gateways";
import { makePgUserAccountRepo } from "@/main/factories/infra/repos/postgres";
import { makeJwtTokenHandler } from "@/main/factories/infra/gateways";

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const facebookApi = makeFacebookApi();
  const pgUserAccountRepo = makePgUserAccountRepo();
  const JwtTokenHandler = makeJwtTokenHandler();
  return new FacebookAuthenticationUseCase(facebookApi, pgUserAccountRepo, JwtTokenHandler);
};
