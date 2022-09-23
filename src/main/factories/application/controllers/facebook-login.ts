import { FacebookLoginController } from "@/application/controllers";
import { makeFacebookAuthenticationUseCase } from "@/main/factories/data/use-cases";

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthentication = makeFacebookAuthenticationUseCase();
  return new FacebookLoginController(facebookAuthentication);
};
