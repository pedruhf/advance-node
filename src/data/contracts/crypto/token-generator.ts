export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>;
}

export namespace TokenGenerator {
  export type Params = {
    key: string;
  };

  export type Result = void;
}
