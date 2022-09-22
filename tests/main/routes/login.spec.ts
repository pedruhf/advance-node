import request from "supertest";
import { getConnection } from "typeorm";
import { IBackup } from "pg-mem";

import { app } from "@/main/config/app";
import { PgUser } from "@/infra/repos/postgres/entities";
import { UnauthorizedError } from "@/application/errors";
import { makeFakeDb } from "@/tests/infra/mocks";

describe("Login Routes", () => {
  let backup: IBackup;
  const loadUserSpy = jest.fn();

  jest.mock("@/infra/gateways/facebook-api", () => ({
    FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy }),
  }));

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe("POST /login/facebook", () => {
    test("Should return 200 with accessToken", async () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: "any_id",
        name: "any_name",
        email: "any_email",
      });
      const { status, body } = await request(app)
        .post("/api/login/facebook")
        .send({ token: "valid_token" });

      expect(status).toBe(200);
      expect(body.accessToken).toBeDefined();
    });

    test("Should return 401 with UnauthorizedError", async () => {
      const { status, body } = await request(app)
        .post("/api/login/facebook")
        .send({ token: "invalid_token" });

      expect(status).toBe(401);
      expect(body.error).toBe(new UnauthorizedError().message);
    });
  });
});
