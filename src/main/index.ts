import "./config/module-alias";
import "reflect-metadata";
import { createConnection } from "typeorm";

import { env } from "@/main/config/env";

createConnection()
  .then(async () => {
    const { app } = await import("@/main/config/app");
    app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`));
  })
  .catch(console.error);
