export class ConnectionNotFoundError extends Error {
  constructor() {
    super("Conexão com o banco de dados não encontrada");
    this.name = "ConnectionNotFoundError";
  }
}

export class TransactionNotFoundError extends Error {
  constructor() {
    super("Nenhuma transação encontrada");
    this.name = "TransactionNotFoundError";
  }
}
