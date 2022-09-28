class PgConnection {
  private static instance?: PgConnection;
  private constructor() {}

  static getInstance(): PgConnection {
    if (!PgConnection.instance) {
      PgConnection.instance = new PgConnection();
      return PgConnection.instance;
    }
    return PgConnection.instance;
  }
}

describe("PgConnection", () => {
  test("Should have only one instance", () => {
    const sut = PgConnection.getInstance();
    const sut2 = PgConnection.getInstance();

    expect(sut).toBe(sut2);
  });
});
