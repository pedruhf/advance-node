import { HttpResponse } from "@/application/helpers";

class DbTransactionControllerDecorator {
  constructor (private readonly db: DbTransaction) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>;
}

class DbTransactionSpy implements DbTransaction {
  async openTransaction (): Promise<void> {}
}

describe("DbTransactionControllerDecorator", () => {
  test("Should open transaction", async () => {
    const dbTransactionSpy = new DbTransactionSpy();
    const openTransactionSpy = jest.spyOn(dbTransactionSpy, "openTransaction");
    const sut = new DbTransactionControllerDecorator(dbTransactionSpy);
    await sut.perform({ any: "any" });

    expect(openTransactionSpy).toHaveBeenCalled();
    expect(openTransactionSpy).toHaveBeenCalledTimes(1);
  });
});
