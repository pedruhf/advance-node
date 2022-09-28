import { Controller } from "@/application/controllers";
import { ControllerStub } from "@/tests/application/mocks";

class DbTransactionControllerDecorator {
  constructor(
    private readonly decoratee: Controller,
    private readonly db: DbTransaction
  ) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
    await this.decoratee.perform(httpRequest);
    await this.db.commitTransaction();
    await this.db.closeTransaction();
  }
}

interface DbTransaction {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  commitTransaction: () => Promise<void>;
}

class DbTransactionSpy implements DbTransaction {
  async openTransaction(): Promise<void> {}
  async closeTransaction(): Promise<void> {}
  async commitTransaction(): Promise<void> {}
}

type SutTypes = {
  sut: DbTransactionControllerDecorator;
  decorateeSpy: ControllerStub;
  dbTransactionSpy: DbTransactionSpy;
};

const makeSut = (): SutTypes => {
  const dbTransactionSpy = new DbTransactionSpy();
  const decorateeSpy = new ControllerStub();
  const sut = new DbTransactionControllerDecorator(decorateeSpy, dbTransactionSpy);

  return {
    sut,
    decorateeSpy,
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

  test("Should execute decoratee", async () => {
    const { sut, decorateeSpy } = makeSut();
    const decorateePerformSpy = jest.spyOn(decorateeSpy, "perform");
    await sut.perform({ any: "any" });

    expect(decorateePerformSpy).toHaveBeenCalled();
    expect(decorateePerformSpy).toHaveBeenCalledTimes(1);
  });

  test("Should call commit and close transactions on success", async () => {
    const { sut, dbTransactionSpy } = makeSut();
    const commitTransactionSpy = jest.spyOn(dbTransactionSpy, "commitTransaction");
    const closeTransactionSpy = jest.spyOn(dbTransactionSpy, "closeTransaction");
    await sut.perform({ any: "any" });

    expect(commitTransactionSpy).toHaveBeenCalled();
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1);
    expect(closeTransactionSpy).toHaveBeenCalled();
    expect(closeTransactionSpy).toHaveBeenCalledTimes(1);
  });
});
