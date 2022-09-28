export class ConnectionNotFoundError extends Error {
  constructor() {
    super("Conexão com o banco de dados não encontrada");
    this.name = "ConnectionNotFoundError";
  }
}
