export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`O campo ${fieldName} é obrigatório`);
    this.name = "RequiredFieldError";
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Tipo não suportado. Tipos permitidos: ${allowed.join(", ")}`);
    this.name = "InvalidMimeTypeError";
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMB: number) {
    super(`O tamanho máximo suportado para este tipo de arquivo é ${maxSizeInMB}MB`);
    this.name = "MaxFileSizeError";
  }
}