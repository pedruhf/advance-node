export interface Authorize {
  perform: (params: Authorize.Input) => Promise<Authorize.Output>;
}

export namespace Authorize {
  export type Input = { token: string };
  export type Output = string;
}
