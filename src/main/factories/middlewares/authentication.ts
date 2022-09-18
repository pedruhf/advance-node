import { AuthenticationMiddleware } from "@/application/middlewares";
import { makeJwtTokenHandler } from "../crypto";

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler();
  const authorize = jwt.validateToken.bind(jwt);
  return new AuthenticationMiddleware(authorize);
};
