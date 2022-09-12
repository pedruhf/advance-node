import "./config/module-alias";
import "reflect-metadata";

import { app } from "./config/app";
import { env } from "./config/env";

app.listen(env.port, () =>
  console.log(`Server is running at http://localhost:${env.port}`)
);
