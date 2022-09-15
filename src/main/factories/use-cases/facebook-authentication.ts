import { FacebookAuthenticationUseCase } from "@/data/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepo } from "@/main/factories/repos";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  const facebookApi = makeFacebookApi();
  const pgUserAccountRepo = makePgUserAccountRepo();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return new FacebookAuthenticationUseCase(facebookApi, pgUserAccountRepo, jwtTokenGenerator);
};
