import "./config/module-alias";
import "reflect-metadata";

import { env } from "@/main/config/env";
import { PgConnection } from "@/infra/repos/postgres/helpers";

PgConnection.getInstance().connect()
  .then(async () => {
    const { app } = await import("@/main/config/app");
    app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`));
  })
  .catch(console.error);
