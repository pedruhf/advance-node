import { FacebookLoginController } from "@/application/controllers";
import { makeFacebookAuthenticationUseCase } from "@/main/factories/use-cases";

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthentication = makeFacebookAuthenticationUseCase();
  return new FacebookLoginController(facebookAuthentication);
};
