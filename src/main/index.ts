import "./config/module-alias";
import "reflect-metadata";
import { createConnection } from "typeorm";

import { app } from "./config/app";
import { env } from "./config/env";
import { config } from "@/infra/postgres/helpers";

createConnection(config)
  .then(() => {
    app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`));
  })
  .catch(console.error);
