import "./config/module-alias";
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";

import { env } from "@/main/config/env";

getConnectionOptions()
  .then(async (options) => {
    const root = process.env.TS_NODE_DEV ? "src" : "dist/src";
    const entities = [`${root}/infra/repos/postgres/entities/index.{ts,js}`];
    await createConnection({ ...options, entities });
    const { app } = await import("@/main/config/app");
    app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`));
  })
  .catch(console.error);
