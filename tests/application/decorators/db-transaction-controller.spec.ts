import { HttpResponse } from "@/application/helpers";

class DbTransactionControllerDecorator {
  constructor(private readonly db: DbTransaction) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>;
}

class DbTransactionSpy implements DbTransaction {
  async openTransaction(): Promise<void> {}
}

type SutTypes = {
  sut: DbTransactionControllerDecorator;
  dbTransactionSpy: DbTransactionSpy;
};

const makeSut = (): SutTypes => {
  const dbTransactionSpy = new DbTransactionSpy();
  const sut = new DbTransactionControllerDecorator(dbTransactionSpy);

  return {
    sut,
    dbTransactionSpy,
  };
};

describe("DbTransactionControllerDecorator", () => {
  test("Should open transaction", async () => {
    const { sut, dbTransactionSpy } = makeSut();
    const openTransactionSpy = jest.spyOn(dbTransactionSpy, "openTransaction");
    await sut.perform({ any: "any" });

    expect(openTransactionSpy).toHaveBeenCalled();
    expect(openTransactionSpy).toHaveBeenCalledTimes(1);
  });
});
