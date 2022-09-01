export interface LoadUserAccountByEmailRepository {
  load: (
    params: LoadUserAccountByEmailRepository.Params
  ) => Promise<LoadUserAccountByEmailRepository.Result>;
}

export namespace LoadUserAccountByEmailRepository {
  export type Params = {
    email: string;
  };

  export type Result =
    | {
        id: string;
        name?: string;
      }
    | undefined;
}

export interface CreateUserAccountByFacebookRepository {
  create: (
    params: CreateUserAccountByFacebookRepository.Params
  ) => Promise<CreateUserAccountByFacebookRepository.Result>;
}

export namespace CreateUserAccountByFacebookRepository {
  export type Params = {
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = void;
}

export interface UpdateFacebookUserAccountRepository {
  update: (
    params: UpdateFacebookUserAccountRepository.Params
  ) => Promise<UpdateFacebookUserAccountRepository.Result>;
}

export namespace UpdateFacebookUserAccountRepository {
  export type Params = {
    id: string;
    name: string;
    facebookId: string;
  };

  export type Result = void;
}
