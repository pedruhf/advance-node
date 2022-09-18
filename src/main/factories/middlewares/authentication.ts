import { AuthenticationMiddleware } from "@/application/middlewares";
import { AuthorizeUseCase } from "@/data/use-cases";
import { makeJwtTokenHandler } from "../crypto";

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = new AuthorizeUseCase(makeJwtTokenHandler());
  return new AuthenticationMiddleware(authorize);
};
