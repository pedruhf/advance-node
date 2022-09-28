import { createConnection, getConnection, getConnectionManager, QueryRunner } from "typeorm";

jest.mock("typeorm", () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn(),
}));

class PgConnection {
  private static instance?: PgConnection;
  private queryRunner?: QueryRunner;

  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
      return PgConnection.instance;
    }
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const connection = getConnectionManager().has("default")
      ? getConnection()
      : await createConnection();
    this.queryRunner = connection.createQueryRunner();
  }

  async disconnect(): Promise<void> {
    await getConnection().close();
    this.queryRunner = undefined;
  }
}

describe("PgConnection", () => {
  let getConnectionManagerSpy: jest.Mock;
  let createQueryRunnerSpy: jest.Mock;
  let createConnectionSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;
  let hasSpy: jest.Mock;
  let closeSpy: jest.Mock;
  let sut: PgConnection;

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true);
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy,
    });
    jest.mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy);
    createQueryRunnerSpy = jest.fn();
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
    hasSpy.mockReturnValueOnce(false),
    await sut.connect();

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
});
