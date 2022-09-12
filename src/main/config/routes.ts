import { readdirSync } from "fs";
import { join } from "path";
import { Express, Router } from "express";

export const setupRoutes = (app: Express): void => {
  const router = Router();
  readdirSync(join(__dirname, "../routes"))
    .filter((file) => !file.endsWith(".map"))
    .map(async (file) => {
      (await import(`../routes/${file}`)).default(router);
    });
  app.use(router);
};
