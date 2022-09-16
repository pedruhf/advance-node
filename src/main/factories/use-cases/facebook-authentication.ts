import { FacebookAuthenticationUseCase } from "@/data/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepo } from "@/main/factories/repos";
import { makeJwtTokenHandler } from "@/main/factories/crypto";

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const facebookApi = makeFacebookApi();
  const pgUserAccountRepo = makePgUserAccountRepo();
  const JwtTokenHandler = makeJwtTokenHandler();
  return new FacebookAuthenticationUseCase(facebookApi, pgUserAccountRepo, JwtTokenHandler);
};
