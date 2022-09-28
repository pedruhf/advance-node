import { DbTransaction } from "@/application/contracts";

export class DbTransactionSpy implements DbTransaction {
  async openTransaction(): Promise<void> {}
  async closeTransaction(): Promise<void> {}
  async commitTransaction(): Promise<void> {}
  async rollbackTransaction(): Promise<void> {}
}
