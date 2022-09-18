import request from "supertest";

import { ForbiddenError } from "@/application/errors";
import { app } from "@/main/config/app";
import { auth } from "@/main/middlewares";

describe("Authetication Middleware", () => {
  test("Should return 403 if authrozization header as not provided", async () => {
    app.get("/fake_route", auth);
    const { status, body } = await request(app).get("/fake_route");

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });
});
