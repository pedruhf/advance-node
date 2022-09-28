import { createConnection, getConnection, getConnectionManager } from "typeorm";

import { PgConnection, ConnectionNotFoundError } from "@/infra/repos/postgres/helpers";

jest.mock("typeorm", () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

describe("PgConnection", () => {
  let getConnectionManagerSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let hasSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let startTransactionSpy: jest.Mock;
  let releaseSpy: jest.Mock;
  let commitTransactionSpy: jest.Mock;
  let rollbackTransactionSpy: jest.Mock;
  let sut: PgConnection;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy,
    });
    jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    startTransactionSpy = jest.fn();
    releaseSpy = jest.fn();
    commitTransactionSpy = jest.fn();
    rollbackTransactionSpy = jest.fn();
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy,
      commitTransaction: commitTransactionSpy,
      rollbackTransaction: rollbackTransactionSpy,
    });
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy,
    });
    jest.mocked(createConnection).mockImplementation(createConnectionSpy);
    closeSpy = jest.fn();
    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy,
    });
    jest.mocked(getConnection).mockImplementation(getConnectionSpy);
  });

  beforeEach(() => {
    sut = PgConnection.getInstance();
  });

  test("Should have only one instance", () => {
    const sut2 = PgConnection.getInstance();

    expect(sut).toBe(sut2);
  });

  test("Should create a new connection", async () => {
    hasSpy.mockReturnValueOnce(false), await sut.connect();

    expect(createConnectionSpy).toHaveBeenCalledWith();
    expect(createConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  test("Should use an existing connection", async () => {
    await sut.connect();

    expect(getConnectionSpy).toHaveBeenCalledWith();
    expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    expect(createQueryRunnerSpy).toHaveBeenCalledWith();
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1);
  });

  test("Should close connection", async () => {
    await sut.connect();
    await sut.disconnect();

    expect(closeSpy).toHaveBeenCalledWith();
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  test("Should return ConnectionNotFoundError on disconnect when connection does not exists", async () => {
    const promise = sut.disconnect();

    expect(closeSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
  });

  test("Should open transaction", async () => {
    await sut.connect();
    await sut.openTransaction();

    expect(startTransactionSpy).toHaveBeenCalledWith();
    expect(startTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  test("Should return ConnectionNotFoundError on openTransaction when connection does not exists", async () => {
    const promise = sut.openTransaction();

    expect(startTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
  });

  test("Should close transaction", async () => {
    await sut.connect();
    await sut.closeTransaction();

    expect(releaseSpy).toHaveBeenCalledWith();
    expect(releaseSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  test("Should return ConnectionNotFoundError on closeTransaction when connection does not exists", async () => {
    const promise = sut.closeTransaction();

    expect(releaseSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
  });

  test("Should commit transaction", async () => {
    await sut.connect();
    await sut.commitTransaction();

    expect(commitTransactionSpy).toHaveBeenCalledWith();
    expect(commitTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  test("Should return ConnectionNotFoundError on commitTransaction when connection does not exists", async () => {
    const promise = sut.commitTransaction();

    expect(commitTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
  });

  test("Should rollback transaction", async () => {
    await sut.connect();
    await sut.rollbackTransaction();

    expect(rollbackTransactionSpy).toHaveBeenCalledWith();
    expect(rollbackTransactionSpy).toHaveBeenCalledTimes(1);

    await sut.disconnect();
  });

  test("Should return ConnectionNotFoundError on rollbackTransaction when connection does not exists", async () => {
    const promise = sut.rollbackTransaction();

    expect(rollbackTransactionSpy).not.toHaveBeenCalled();
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError());
  });
});
