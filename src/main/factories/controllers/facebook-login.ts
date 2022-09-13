import { FacebookLoginController } from "@/application/controllers";
import { makeFacebookAuthenticationUsecase } from "@/main/factories/usecases";

export const makeFacebookLoginController = (): FacebookLoginController => {
  const facebookAuthentication = makeFacebookAuthenticationUsecase();
  return new FacebookLoginController(facebookAuthentication);
};
