import request from "supertest";
import jwt from "jsonwebtoken";

import { ForbiddenError } from "@/application/errors";
import { app } from "@/main/config/app";
import { auth } from "@/main/middlewares";
import { env } from "@/main/config/env";

describe("Authetication Middleware", () => {
  test("Should return 403 if authrozization header as not provided", async () => {
    app.get("/fake_route", auth);
    const { status, body } = await request(app).get("/fake_route");

    expect(status).toBe(403);
    expect(body.error).toBe(new ForbiddenError().message);
  });

  test("Should return 200 if authrozization header is valid", async () => {
    const authorization = jwt.sign({ key: "any_user_id" }, env.jwtSecret);
    app.get("/fake_route", auth, (req, res) => {
      res.json(req.locals);
    });
    const { status, body } = await request(app).get("/fake_route").set({ authorization });

    expect(status).toBe(200);
    expect(body).toEqual({ userId: "any_user_id" });
  });
});
