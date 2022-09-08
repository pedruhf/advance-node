export class ServerError extends Error {
  constructor(error?: Error) {
    super("Server failed. Try again soon");
    this.name = "ServerError";
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The ${fieldName} token is required`);
    this.name = "RequiredFieldError";
  }
}
