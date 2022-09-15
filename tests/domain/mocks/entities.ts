import { AccountModel, FacebookModel } from "@/domain/entities";

export const fbModelMock = (): FacebookModel => ({
  name: "any_facebook_name",
  email: "any_facebook_email",
  facebookId: "any_facebook_id",
});

export const accountModelmock = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
});
