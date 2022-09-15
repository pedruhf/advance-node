export type FacebookModel = {
  name: string;
  email: string;
  facebookId: string;
};

export type AccountModel = {
  id?: string;
  name?: string;
};

export class FacebookAccount {
  id?: string;
  name: string;
  email: string;
  facebookId: string;

  constructor(fbData: FacebookModel, accountData?: AccountModel) {
    this.id = accountData?.id;
    this.name = accountData?.name ?? fbData.name;
    this.email = fbData.email;
    this.facebookId = fbData.facebookId;
  }
}
