import { FacebookAuthenticationUsecase } from "@/data/usecases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepo } from "@/main/factories/repos";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthenticationUsecase = (): FacebookAuthenticationUsecase => {
  const facebookApi = makeFacebookApi();
  const pgUserAccountRepo = makePgUserAccountRepo();
  const jwtTokenGenerator = makeJwtTokenGenerator();
  return new FacebookAuthenticationUsecase(facebookApi, pgUserAccountRepo, jwtTokenGenerator);
};
