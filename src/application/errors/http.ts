export class ServerError extends Error {
  constructor(error?: Error) {
    super("Erro inesperado. Tente novamente em breve");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autorizado");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Acesso negado!");
    this.name = "ForbiddenError";
  }
}
