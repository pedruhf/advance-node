export interface LoadUserAccountByEmailRepository {
  load: (
    params: LoadUserAccountByEmailRepository.Params
  ) => Promise<LoadUserAccountByEmailRepository.Result>;
}

export namespace LoadUserAccountByEmailRepository {
  export type Params = {
    email: string;
  };

  export type Result = void;
}
