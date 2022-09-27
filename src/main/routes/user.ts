import { Router } from "express";

import { auth } from "@/main/middlewares";
import { adaptExpressRoute } from "@/main/adapters";
import { makeDeleteProfilePictureController } from "@/main/factories/application/controllers";

export default (router: Router): void => {
  router.delete("/users/picture", auth, adaptExpressRoute(makeDeleteProfilePictureController()));
};
