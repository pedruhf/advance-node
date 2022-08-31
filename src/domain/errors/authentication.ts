export class AuthenticationError extends Error {
  constructor() {
    super("Erro de autenticação");
    this.name = "AuthenticationError";
  }
}
