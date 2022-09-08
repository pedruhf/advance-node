export class ServerError extends Error {
  constructor(error?: Error) {
    super("Erro inesperado. Tente novamente em breve");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`O campo ${fieldName} é obrigatório`);
    this.name = "RequiredFieldError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autorizado");
    this.name = "UnauthorizedError";
  }
}
