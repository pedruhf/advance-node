export interface LoadUserAccountByEmailRepo {
  load: (
    params: LoadUserAccountByEmailRepo.Params
  ) => Promise<LoadUserAccountByEmailRepo.Result>;
}

export namespace LoadUserAccountByEmailRepo {
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

export interface SaveFacebookAccountRepo {
  saveWithFacebook: (
    params: SaveFacebookAccountRepo.Params
  ) => Promise<SaveFacebookAccountRepo.Result>;
}

export namespace SaveFacebookAccountRepo {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = void;
}
